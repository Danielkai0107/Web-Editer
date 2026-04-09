"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { defaultModules } from "@/lib/modules/defaults";
import MediaPickerModal from "./media-picker-modal";

/* eslint-disable @typescript-eslint/no-explicit-any */
type GrapesEditorInstance = any;
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Rocket,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Layers,
  LayoutGrid,
  GripVertical,
  Trash2,
  Image as ImageIcon,
  Palette,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GrapesEditorProps {
  pageId: string;
  siteId: string;
  initialContent: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onPublish: () => Promise<void>;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

interface LayerItem {
  id: string;
  name: string;
  moduleType: string;
}

interface SectionImages {
  componentId: string;
  src: string;
}

interface SectionLink {
  componentId: string;
  text: string;
  href: string;
  isButton: boolean;
}

const DRAG_TYPE_LAYER = "application/x-layer-idx";
const DRAG_TYPE_BLOCK = "application/x-block-id";

export default function GrapesEditor({
  siteId,
  initialContent,
  onSave,
  onPublish,
}: GrapesEditorProps) {
  const editorRef = useRef<GrapesEditorInstance>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<DeviceMode>("desktop");
  const [activePanel, setActivePanel] = useState<"blocks" | "layers">("blocks");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Right panel state
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sectionBgColor, setSectionBgColor] = useState<string>("");
  const [sectionBgImage, setSectionBgImage] = useState<string>("");
  const [sectionPaddingTop, setSectionPaddingTop] = useState<number>(100);
  const [sectionPaddingBottom, setSectionPaddingBottom] = useState<number>(100);
  const [sectionImages, setSectionImages] = useState<SectionImages[]>([]);
  const [sectionLinks, setSectionLinks] = useState<SectionLink[]>([]);

  // Media picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    { type: "image"; componentId: string } | { type: "bg" } | null
  >(null);

  // Layers
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragSourceRef = useRef<{ type: "layer" | "block"; value: string } | null>(null);

  // Canvas drop
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);

  const saveContent = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;
    setSaving(true);
    const data = {
      html: editor.getHtml(),
      css: editor.getCss(),
      components: JSON.parse(JSON.stringify(editor.getComponents())),
      styles: JSON.parse(JSON.stringify(editor.getStyle())),
    };
    await onSave(data);
    setLastSaved(new Date());
    setSaving(false);
  }, [onSave]);

  function refreshLayers() {
    const editor = editorRef.current;
    if (!editor) return;
    const wrapper = editor.getWrapper();
    const children = wrapper.components().models;
    const items: LayerItem[] = children.map((c: any) => {
      const el = c.getEl();
      const modAttr =
        c.getAttributes()["data-module"] ||
        el?.getAttribute?.("data-module") ||
        "";
      const mod = defaultModules.find((m) => m.id === modAttr);
      return {
        id: c.getId(),
        name: mod?.name || modAttr || c.getName() || "\u5340\u584a",
        moduleType: modAttr,
      };
    });
    setLayers(items);
  }

  function lockComponentTree(component: any) {
    const tagName = component.get("tagName")?.toLowerCase() || "";
    const attrs = component.getAttributes() || {};
    const isTopLevel = component.parent()?.is("wrapper");

    if (isTopLevel) {
      component.set({
        draggable: true,
        droppable: false,
        removable: true,
        copyable: false,
        badgable: true,
        selectable: true,
        hoverable: true,
        editable: false,
        toolbar: [
          {
            attributes: { class: "gjs-toolbar-move", title: "拖曳排序" },
            command: "tlb-move",
          },
          {
            attributes: { class: "gjs-toolbar-delete", title: "刪除區塊" },
            command: "tlb-delete",
          },
        ],
      });
    } else {
      const isEditable = !!attrs["data-editable"];
      const isImage = tagName === "img";

      component.set({
        draggable: false,
        droppable: false,
        removable: false,
        copyable: false,
        badgable: false,
        selectable: isEditable || isImage,
        hoverable: isEditable || isImage,
        editable: isEditable,
        toolbar: [],
      });
    }

    component.components().forEach((child: any) => lockComponentTree(child));
  }

  function selectSection(component: any) {
    if (!component) {
      setSelectedSectionId(null);
      return;
    }

    let target = component;
    while (target && !target.parent()?.is("wrapper")) {
      target = target.parent();
    }
    if (!target || !target.parent()?.is("wrapper")) {
      setSelectedSectionId(null);
      return;
    }

    const id = target.getId();
    setSelectedSectionId(id);

    const styles = target.getStyle();
    setSectionBgColor(styles["background-color"] || styles["background"] || "");

    const bgImg = styles["background-image"] || "";
    const urlMatch = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
    setSectionBgImage(urlMatch ? urlMatch[1] : "");

    const pt = parseInt(styles["padding-top"] || "100", 10);
    const pb = parseInt(styles["padding-bottom"] || "100", 10);
    setSectionPaddingTop(isNaN(pt) ? 100 : pt);
    setSectionPaddingBottom(isNaN(pb) ? 100 : pb);

    const images: SectionImages[] = [];
    const links: SectionLink[] = [];
    function findElements(comp: any) {
      const tag = (comp.get("tagName") || "").toLowerCase();
      if (tag === "img") {
        images.push({
          componentId: comp.getId(),
          src: comp.getAttributes().src || "",
        });
      }
      if (tag === "a") {
        const attrs = comp.getAttributes();
        const el = comp.getEl();
        const text = el?.textContent?.trim() || attrs["data-editable"] || "連結";
        const classList = attrs.class || "";
        const isButton = /btn|button|cta/i.test(classList);
        links.push({
          componentId: comp.getId(),
          text: text.substring(0, 20),
          href: attrs.href || "#",
          isButton,
        });
      }
      comp.components().forEach((c: any) => findElements(c));
    }
    findElements(target);
    setSectionImages(images);
    setSectionLinks(links);
  }

  function refreshSelectedSection() {
    if (!selectedSectionId) return;
    const editor = editorRef.current;
    if (!editor) return;
    const section = findComponentById(editor, selectedSectionId);
    if (section) selectSection(section);
  }

  // Insert a module at a specific index in the wrapper
  function insertModuleAt(moduleId: string, atIndex: number) {
    const editor = editorRef.current;
    if (!editor) return;
    const mod = defaultModules.find((m) => m.id === moduleId);
    if (!mod) return;

    editor.select(null);
    const wrapper = editor.getWrapper();
    const added = wrapper.append(mod.html, { at: atIndex });
    editor.addStyle(mod.css);

    setTimeout(() => {
      if (added && added.length > 0) {
        lockComponentTree(added[0]);
      }
      refreshLayers();
      if (added && added.length > 0) {
        const el = added[0].getEl();
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    let mounted = true;

    async function initEditor() {
      const grapesjs = (await import("grapesjs")).default;

      if (!mounted || !containerRef.current) return;

      const allCss = defaultModules.map((m) => m.css).join("\n");

      const editor = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        height: "100%",
        width: "auto",
        storageManager: false,
        panels: { defaults: [] },
        deviceManager: {
          devices: [
            { name: "Desktop", width: "" },
            { name: "Tablet", width: "768px" },
            { name: "Mobile", width: "375px" },
          ],
        },
        canvas: {
          styles: [
            "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap",
          ],
        },
        blockManager: { custom: true },
        selectorManager: { componentFirst: true },
        styleManager: { sectors: [] },
        richTextEditor: {
          actions: ["bold", "italic", "underline", "strikethrough", "link"],
        },
      });

      defaultModules.forEach((mod) => {
        editor.BlockManager.add(mod.id, {
          label: mod.name,
          category: mod.category,
          content: {
            type: "wrapper",
            components: mod.html,
            styles: mod.css,
          },
          media: `<div style="padding:8px;font-size:12px;text-align:center;">${mod.name}</div>`,
        });
      });

      if (
        initialContent &&
        typeof initialContent === "object" &&
        "components" in initialContent &&
        "styles" in initialContent
      ) {
        editor.setComponents(initialContent.components as string);
        editor.setStyle(initialContent.styles as string);
      } else {
        editor.addStyle(allCss);
      }

      const wrapper = editor.getWrapper();
      if (!wrapper) return;
      wrapper.set({ droppable: true });
      wrapper.components().forEach((c: any) => lockComponentTree(c));

      editor.on("component:add", (component: any) => {
        setTimeout(() => {
          const parent = component.parent();
          if (parent && parent.is("wrapper")) {
            lockComponentTree(component);
          }
          refreshLayers();
        }, 50);
      });

      editor.on("component:remove", () => {
        setTimeout(refreshLayers, 50);
      });

      editor.on("component:drag:end", () => {
        setTimeout(refreshLayers, 100);
      });

      editor.on("component:selected", (component: any) => {
        selectSection(component);
      });

      editor.on("component:deselected", () => {
        setSelectedSectionId(null);
      });

      editor.on("component:dblclick", (component: any) => {
        const tag = (component.get("tagName") || "").toLowerCase();
        if (tag === "img") {
          setMediaPickerTarget({
            type: "image",
            componentId: component.getId(),
          });
          setMediaPickerOpen(true);
        }
      });

      editorRef.current = editor;
      refreshLayers();
    }

    initEditor();

    return () => {
      mounted = false;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      saveContent();
    }, 30000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [saveContent]);

  useEffect(() => {
    function onGlobalDragEnd() {
      setIsDraggingBlock(false);
    }
    window.addEventListener("dragend", onGlobalDragEnd);
    return () => window.removeEventListener("dragend", onGlobalDragEnd);
  }, []);

  function handleDeviceChange(device: DeviceMode) {
    setActiveDevice(device);
    const editor = editorRef.current;
    if (!editor) return;
    const map = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
    editor.setDevice(map[device]);
  }

  async function handlePublish() {
    setPublishing(true);
    await saveContent();
    await onPublish();
    setPublishing(false);
  }

  function handleUndo() {
    editorRef.current?.UndoManager.undo();
  }
  function handleRedo() {
    editorRef.current?.UndoManager.redo();
  }

  function togglePreview() {
    const editor = editorRef.current;
    if (!editor) return;
    if (previewing) {
      editor.stopCommand("preview");
      const iframe = editor.Canvas.getFrameEl();
      const iframeDoc = iframe?.contentDocument;
      if (iframeDoc) {
        iframeDoc.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
          a.removeEventListener("click", handlePreviewLinkClick);
        });
      }
      setPreviewing(false);
    } else {
      editor.runCommand("preview");
      setTimeout(() => {
        const iframe = editor.Canvas.getFrameEl();
        const iframeDoc = iframe?.contentDocument;
        if (iframeDoc) {
          iframeDoc.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
            a.addEventListener("click", handlePreviewLinkClick);
          });
        }
      }, 100);
      setPreviewing(true);
    }
  }

  function handlePreviewLinkClick(e: MouseEvent) {
    const anchor = e.currentTarget as HTMLAnchorElement;
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    e.preventDefault();
    window.open(href, "_blank", "noopener");
  }

  // --- Right panel handlers ---

  function handleBgColorChange(color: string) {
    setSectionBgColor(color);
    const editor = editorRef.current;
    if (!editor || !selectedSectionId) return;
    const comp = findComponentById(editor, selectedSectionId);
    if (comp) comp.addStyle({ "background-color": color });
  }

  function handlePaddingChange(which: "top" | "bottom", value: number) {
    if (which === "top") setSectionPaddingTop(value);
    else setSectionPaddingBottom(value);
    const editor = editorRef.current;
    if (!editor || !selectedSectionId) return;
    const comp = findComponentById(editor, selectedSectionId);
    if (comp) comp.addStyle({ [`padding-${which}`]: `${value}px` });
  }

  function openMediaPickerForBg() {
    setMediaPickerTarget({ type: "bg" });
    setMediaPickerOpen(true);
  }

  function openMediaPickerForImage(componentId: string) {
    setMediaPickerTarget({ type: "image", componentId });
    setMediaPickerOpen(true);
  }

  function handleLinkChange(componentId: string, href: string) {
    const editor = editorRef.current;
    if (!editor) return;
    const comp = findComponentById(editor, componentId);
    if (comp) {
      comp.setAttributes({ ...comp.getAttributes(), href });
      setSectionLinks((prev) =>
        prev.map((l) => (l.componentId === componentId ? { ...l, href } : l))
      );
    }
  }

  function handleMediaSelect(url: string) {
    const editor = editorRef.current;
    if (!editor || !mediaPickerTarget) return;

    if (mediaPickerTarget.type === "bg" && selectedSectionId) {
      const comp = findComponentById(editor, selectedSectionId);
      if (comp) {
        comp.addStyle({
          "background-image": `url(${url})`,
          "background-size": "cover",
          "background-position": "center",
        });
        setSectionBgImage(url);
      }
    } else if (mediaPickerTarget.type === "image") {
      const comp = findComponentById(editor, mediaPickerTarget.componentId);
      if (comp) {
        comp.setAttributes({ ...comp.getAttributes(), src: url });
      }
    }
    setMediaPickerTarget(null);
    setTimeout(refreshSelectedSection, 100);
  }

  function handleImageReset(componentId: string) {
    const editor = editorRef.current;
    if (!editor) return;
    const comp = findComponentById(editor, componentId);
    if (comp) {
      comp.setAttributes({
        ...comp.getAttributes(),
        src: "https://placehold.co/600x400/F0F4FF/086CF2?text=Image",
      });
    }
    setTimeout(refreshSelectedSection, 100);
  }

  function handleBgImageReset() {
    const editor = editorRef.current;
    if (!editor || !selectedSectionId) return;
    const comp = findComponentById(editor, selectedSectionId);
    if (comp) {
      comp.addStyle({ "background-image": "none" });
      setSectionBgImage("");
    }
  }

  // --- Unified drag system for both layer reorder + block insertion ---

  function handleDragStartLayer(e: React.DragEvent, idx: number) {
    dragSourceRef.current = { type: "layer", value: String(idx) };
    e.dataTransfer.setData(DRAG_TYPE_LAYER, String(idx));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragStartBlock(e: React.DragEvent, moduleId: string) {
    dragSourceRef.current = { type: "block", value: moduleId };
    e.dataTransfer.setData(DRAG_TYPE_BLOCK, moduleId);
    e.dataTransfer.effectAllowed = "copy";
    setIsDraggingBlock(true);
  }

  function handleLayerDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragSourceRef.current?.type === "block" ? "copy" : "move";
    setDragOverIdx(idx);
  }

  function handleLayerDragLeave() {
    setDragOverIdx(null);
  }

  function handleLayerDrop(e: React.DragEvent, dropIdx: number) {
    e.preventDefault();
    setDragOverIdx(null);

    const source = dragSourceRef.current;
    if (!source) return;
    dragSourceRef.current = null;

    if (source.type === "block") {
      insertModuleAt(source.value, dropIdx);
    } else if (source.type === "layer") {
      const fromIdx = Number(source.value);
      if (fromIdx === dropIdx) return;
      const editor = editorRef.current;
      if (!editor) return;
      const wrapper = editor.getWrapper();
      const children = wrapper.components();
      const comp = children.models[fromIdx];
      if (!comp) return;
      children.remove(comp);
      const targetIdx = fromIdx < dropIdx ? dropIdx - 1 : dropIdx;
      children.add(comp, { at: targetIdx });
      refreshLayers();
    }
  }

  function handleLayerDragEnd() {
    setDragOverIdx(null);
    dragSourceRef.current = null;
  }

  // --- Canvas drop (drag block from sidebar onto the canvas directly) ---

  function handleCanvasDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingBlock(false);

    const source = dragSourceRef.current;
    if (!source || source.type !== "block") return;
    dragSourceRef.current = null;

    const editor = editorRef.current;
    if (!editor) return;

    const wrapper = editor.getWrapper();
    const children = wrapper.components().models;
    let insertIdx = children.length;

    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe && children.length > 0) {
      const iframeRect = iframe.getBoundingClientRect();
      const relativeY = e.clientY - iframeRect.top;

      for (let i = 0; i < children.length; i++) {
        const el = children[i].getEl();
        if (el) {
          const elRect = el.getBoundingClientRect();
          if (relativeY < elRect.top + elRect.height / 2) {
            insertIdx = i;
            break;
          }
        }
      }
    }

    insertModuleAt(source.value, insertIdx);
  }

  // Also accept drops at the very end
  function handleLayerEndZoneDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOverIdx(null);

    const source = dragSourceRef.current;
    if (!source) return;
    dragSourceRef.current = null;

    const editor = editorRef.current;
    if (!editor) return;
    const wrapper = editor.getWrapper();
    const totalCount = wrapper.components().length;

    if (source.type === "block") {
      insertModuleAt(source.value, totalCount);
    } else if (source.type === "layer") {
      const fromIdx = Number(source.value);
      const children = wrapper.components();
      const comp = children.models[fromIdx];
      if (!comp) return;
      children.remove(comp);
      children.add(comp, { at: children.length });
      refreshLayers();
    }
  }

  function handleLayerDelete(layerId: string) {
    const editor = editorRef.current;
    if (!editor) return;
    const comp = findComponentById(editor, layerId);
    if (comp) {
      comp.remove();
      refreshLayers();
      if (selectedSectionId === layerId) setSelectedSectionId(null);
    }
  }

  function handleLayerMoveUp(idx: number) {
    if (idx <= 0) return;
    const editor = editorRef.current;
    if (!editor) return;
    const wrapper = editor.getWrapper();
    const children = wrapper.components();
    const comp = children.models[idx];
    children.remove(comp);
    children.add(comp, { at: idx - 1 });
    refreshLayers();
  }

  function handleLayerMoveDown(idx: number) {
    const editor = editorRef.current;
    if (!editor) return;
    const wrapper = editor.getWrapper();
    const children = wrapper.components();
    if (idx >= children.length - 1) return;
    const comp = children.models[idx];
    children.remove(comp);
    children.add(comp, { at: idx + 1 });
    refreshLayers();
  }

  function handleLayerClick(layerId: string) {
    const editor = editorRef.current;
    if (!editor) return;
    const comp = findComponentById(editor, layerId);
    if (comp) {
      editor.select(comp);
      comp.getEl()?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Click on block: insert after selected section, or at end
  function handleBlockClick(moduleId: string) {
    const editor = editorRef.current;
    if (!editor) return;

    let insertIdx = editor.getWrapper().components().length;

    if (selectedSectionId) {
      const wrapper = editor.getWrapper();
      const children = wrapper.components().models;
      const selIdx = children.findIndex(
        (c: any) => c.getId() === selectedSectionId
      );
      if (selIdx >= 0) insertIdx = selIdx + 1;
    }

    insertModuleAt(moduleId, insertIdx);
  }

  const devices: { id: DeviceMode; icon: React.ReactNode; label: string }[] = [
    { id: "desktop", icon: <Monitor className="w-4 h-4" />, label: "\u684c\u6a5f" },
    { id: "tablet", icon: <Tablet className="w-4 h-4" />, label: "\u5e73\u677f" },
    { id: "mobile", icon: <Smartphone className="w-4 h-4" />, label: "\u624b\u6a5f" },
  ];

  const presetColors = [
    "#FFFFFF", "#F8F9FC", "#F0F4FF", "#0A0E1A", "#1A202C",
    "#086CF2", "#34D399", "#F59E0B", "#F87171", "#A78BFA",
  ];

  const showRightPanel = !!selectedSectionId && !previewing;

  return (
    <div className="h-screen flex flex-col bg-bg-base">
      {/* Toolbar */}
      <div className="h-12 bg-bg-card border-b border-border flex items-center px-3 gap-2 shrink-0">
        {previewing ? (
          <>
            <button
              onClick={togglePreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#0A0E1A] rounded-lg hover:bg-[#0A0E1A]/90 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              {"\u9000\u51fa\u9810\u89bd"}
            </button>
            <div className="flex-1" />
            <div className="flex items-center bg-bg-base rounded-lg p-0.5">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDeviceChange(d.id)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    activeDevice === d.id
                      ? "bg-bg-card shadow-sm text-accent"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                  title={d.label}
                >
                  {d.icon}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <a
              href={`/dashboard/sites/${siteId}`}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors mr-2"
            >
              {"\u2190 \u8fd4\u56de"}
            </a>
            <div className="h-5 w-px bg-border mx-1" />
            <button onClick={handleUndo} className="p-2 rounded-lg hover:bg-bg-card-elevated transition-colors" title="Undo">
              <Undo2 className="w-4 h-4 text-text-secondary" />
            </button>
            <button onClick={handleRedo} className="p-2 rounded-lg hover:bg-bg-card-elevated transition-colors" title="Redo">
              <Redo2 className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="h-5 w-px bg-border mx-1" />
            <div className="flex items-center bg-bg-base rounded-lg p-0.5">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDeviceChange(d.id)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    activeDevice === d.id
                      ? "bg-bg-card shadow-sm text-accent"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                  title={d.label}
                >
                  {d.icon}
                </button>
              ))}
            </div>
            <div className="h-5 w-px bg-border mx-1" />
            <button
              onClick={togglePreview}
              className="p-2 rounded-lg hover:bg-bg-card-elevated transition-colors"
              title={"\u9810\u89bd"}
            >
              <Eye className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="flex-1" />
            {lastSaved && (
              <span className="text-xs text-text-muted hidden sm:block">
                {"\u5df2\u5132\u5b58"} {lastSaved.toLocaleTimeString("zh-TW")}
              </span>
            )}
            <button
              onClick={saveContent}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-primary bg-bg-card border border-border-strong rounded-lg hover:bg-bg-card-elevated transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "\u5132\u5b58\u4e2d..." : "\u5132\u5b58"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              <Rocket className="w-4 h-4" />
              {publishing ? "\u767c\u5e03\u4e2d..." : "\u767c\u5e03"}
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {!previewing && (
          <div className="w-10 bg-bg-card border-r border-border flex flex-col items-center py-2 gap-1 shrink-0">
            <button
              onClick={() => setActivePanel("blocks")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activePanel === "blocks"
                  ? "bg-accent-glow text-accent"
                  : "text-text-muted hover:text-text-secondary"
              )}
              title={"\u6a21\u7d44\u5eab"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePanel("layers")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activePanel === "layers"
                  ? "bg-accent-glow text-accent"
                  : "text-text-muted hover:text-text-secondary"
              )}
              title={"\u5716\u5c64"}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        )}

        {!previewing && (
          <div className="w-56 bg-bg-card border-r border-border overflow-y-auto shrink-0">
            {activePanel === "blocks" && (
              <BlocksPanel
                onBlockClick={handleBlockClick}
                onBlockDragStart={handleDragStartBlock}
              />
            )}
            {activePanel === "layers" && (
              <LayersPanel
                layers={layers}
                selectedId={selectedSectionId}
                dragOverIdx={dragOverIdx}
                onLayerDragStart={handleDragStartLayer}
                onDragOver={handleLayerDragOver}
                onDragLeave={handleLayerDragLeave}
                onDrop={handleLayerDrop}
                onDragEnd={handleLayerDragEnd}
                onEndZoneDrop={handleLayerEndZoneDrop}
                onDelete={handleLayerDelete}
                onMoveUp={handleLayerMoveUp}
                onMoveDown={handleLayerMoveDown}
                onClick={handleLayerClick}
              />
            )}
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          <div ref={containerRef} className="w-full h-full" />
          {isDraggingBlock && (
            <div
              className="absolute inset-0 z-50 bg-accent/5 border-2 border-dashed border-accent/30"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 bg-bg-card rounded-xl shadow-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    {"\u653e\u958b\u4ee5\u65b0\u589e\u6a21\u7d44"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {showRightPanel && (
          <div className="w-72 bg-bg-card border-l border-border overflow-y-auto shrink-0">
            <RightPanel
              bgColor={sectionBgColor}
              bgImage={sectionBgImage}
              paddingTop={sectionPaddingTop}
              paddingBottom={sectionPaddingBottom}
              images={sectionImages}
              presetColors={presetColors}
              onBgColorChange={handleBgColorChange}
              onPaddingChange={handlePaddingChange}
              onBgImageClick={openMediaPickerForBg}
              onBgImageReset={handleBgImageReset}
              onImageClick={openMediaPickerForImage}
              onImageReset={handleImageReset}
              links={sectionLinks}
              onLinkChange={handleLinkChange}
            />
          </div>
        )}
      </div>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerTarget(null);
        }}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}

// --- Helper ---

function findComponentById(editor: any, id: string): any {
  function search(comp: any): any {
    if (comp.getId() === id) return comp;
    for (const child of comp.components().models) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  }
  return search(editor.getWrapper());
}

// --- Blocks Panel ---

function BlocksPanel({
  onBlockClick,
  onBlockDragStart,
}: {
  onBlockClick: (moduleId: string) => void;
  onBlockDragStart: (e: React.DragEvent, moduleId: string) => void;
}) {
  const categories = [
    { id: "navbar", label: "\u5c0e\u822a\u5217" },
    { id: "hero", label: "Hero" },
    { id: "feature", label: "Feature" },
    { id: "gallery", label: "Gallery" },
    { id: "cta", label: "CTA" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="p-3">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
        {"\u6a21\u7d44\u5eab"}
      </p>
      <p className="text-[10px] text-text-muted mb-3">
        {"\u9ede\u64ca\u65b0\u589e\uff0c\u6216\u62d6\u66f3\u81f3\u5716\u5c64\u9762\u677f\u6307\u5b9a\u4f4d\u7f6e"}
      </p>
      {categories.map((cat) => {
        const modules = defaultModules.filter((m) => m.category === cat.id);
        if (modules.length === 0) return null;
        return (
          <div key={cat.id} className="mb-4">
            <p className="text-xs font-semibold text-text-secondary mb-2">
              {cat.label}
            </p>
            <div className="space-y-2">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  draggable
                  onDragStart={(e) => onBlockDragStart(e, mod.id)}
                  onClick={() => onBlockClick(mod.id)}
                  className="w-full text-left p-3 rounded-xl border border-border bg-bg-base hover:bg-bg-card-elevated hover:border-border-strong transition-colors cursor-grab active:cursor-grabbing"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {mod.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Layers Panel ---

function LayersPanel({
  layers,
  selectedId,
  dragOverIdx,
  onLayerDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onEndZoneDrop,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClick,
}: {
  layers: LayerItem[];
  selectedId: string | null;
  dragOverIdx: number | null;
  onLayerDragStart: (e: React.DragEvent, idx: number) => void;
  onDragOver: (e: React.DragEvent, idx: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, idx: number) => void;
  onDragEnd: () => void;
  onEndZoneDrop: (e: React.DragEvent) => void;
  onDelete: (id: string) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onClick: (id: string) => void;
}) {
  return (
    <div className="p-3">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        {"\u5716\u5c64\u6392\u5e8f"}
      </p>
      {layers.length === 0 ? (
        <div
          className="border-2 border-dashed border-border rounded-xl py-8 text-center transition-colors"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-accent", "bg-accent-glow");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-accent", "bg-accent-glow");
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove("border-accent", "bg-accent-glow");
            onEndZoneDrop(e);
          }}
        >
          <p className="text-xs text-text-muted">
            {"\u62d6\u66f3\u6a21\u7d44\u5230\u9019\u88e1"}
          </p>
        </div>
      ) : (
        <div onDragLeave={onDragLeave}>
          {layers.map((layer, idx) => (
            <div key={layer.id}>
              {/* Drop zone ABOVE this item */}
              <div
                className={cn(
                  "h-1 rounded-full mx-2 transition-all",
                  dragOverIdx === idx
                    ? "bg-accent my-1"
                    : "bg-transparent"
                )}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={(e) => onDrop(e, idx)}
              />
              {/* Layer item */}
              <div
                draggable
                onDragStart={(e) => onLayerDragStart(e, idx)}
                onDragEnd={onDragEnd}
                onClick={() => onClick(layer.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group",
                  selectedId === layer.id
                    ? "bg-accent-glow border border-accent/20"
                    : "hover:bg-bg-card-elevated border border-transparent"
                )}
              >
                <GripVertical className="w-3.5 h-3.5 text-text-muted cursor-grab shrink-0" />
                <span className="text-xs font-medium text-text-primary truncate flex-1">
                  {layer.name}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onMoveUp(idx); }}
                    className="p-0.5 rounded hover:bg-bg-base transition-colors"
                    title={"\u4e0a\u79fb"}
                  >
                    <ChevronUp className="w-3 h-3 text-text-muted" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onMoveDown(idx); }}
                    className="p-0.5 rounded hover:bg-bg-base transition-colors"
                    title={"\u4e0b\u79fb"}
                  >
                    <ChevronDown className="w-3 h-3 text-text-muted" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(layer.id); }}
                    className="p-0.5 rounded hover:bg-danger-bg transition-colors"
                    title={"\u522a\u9664"}
                  >
                    <Trash2 className="w-3 h-3 text-danger" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Drop zone at the very end */}
          <div
            className={cn(
              "h-8 rounded-lg border-2 border-dashed mt-1 flex items-center justify-center transition-colors",
              dragOverIdx === layers.length
                ? "border-accent bg-accent-glow"
                : "border-transparent"
            )}
            onDragOver={(e) => onDragOver(e, layers.length)}
            onDrop={onEndZoneDrop}
          >
            {dragOverIdx === layers.length && (
              <span className="text-[10px] text-accent">{"\u653e\u5728\u6700\u5f8c"}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Right Panel ---

function RightPanel({
  bgColor,
  bgImage,
  paddingTop,
  paddingBottom,
  images,
  presetColors,
  onBgColorChange,
  onPaddingChange,
  onBgImageClick,
  onBgImageReset,
  onImageClick,
  onImageReset,
  links,
  onLinkChange,
}: {
  bgColor: string;
  bgImage: string;
  paddingTop: number;
  paddingBottom: number;
  images: SectionImages[];
  presetColors: string[];
  onBgColorChange: (c: string) => void;
  onPaddingChange: (which: "top" | "bottom", v: number) => void;
  onBgImageClick: () => void;
  onBgImageReset: () => void;
  onImageClick: (id: string) => void;
  onImageReset: (id: string) => void;
  links: SectionLink[];
  onLinkChange: (componentId: string, href: string) => void;
}) {
  return (
    <div className="p-4 space-y-6">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
        {"\u5340\u584a\u8a2d\u5b9a"}
      </p>

      {/* Background color */}
      <div>
        <p className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          {"\u80cc\u666f\u8272"}
        </p>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => onBgColorChange(c)}
              className={cn(
                "w-full aspect-square rounded-lg border-2 transition-all",
                bgColor === c
                  ? "border-accent scale-110"
                  : "border-border hover:border-accent/40"
              )}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <input
          type="text"
          value={bgColor}
          onChange={(e) => onBgColorChange(e.target.value)}
          placeholder="#FFFFFF"
          className="w-full h-8 px-2 text-xs font-mono rounded-lg border border-border bg-bg-base text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
      </div>

      {/* Background image */}
      <div>
        <p className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          {"\u80cc\u666f\u5716"}
        </p>
        {bgImage ? (
          <div className="rounded-xl border border-border overflow-hidden bg-bg-base">
            <div className="aspect-video relative group">
              <img
                src={bgImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={onBgImageClick}
                  className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-[#0A0E1A] shadow-sm hover:bg-[#F0F4FF] transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  {"\u66ff\u63db"}
                </button>
                <button
                  onClick={onBgImageReset}
                  className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-[#FEE2E2] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#F87171]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onBgImageClick}
            className="w-full h-20 rounded-xl border-2 border-dashed border-border bg-bg-base hover:border-accent/40 hover:bg-accent-glow transition-colors flex flex-col items-center justify-center gap-1"
          >
            <ImageIcon className="w-5 h-5 text-text-muted" />
            <span className="text-xs text-text-muted">
              {"\u9ede\u64ca\u9078\u64c7\u5716\u7247"}
            </span>
          </button>
        )}
      </div>

      {/* Section images */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            {"\u5340\u584a\u5716\u7247"}
          </p>
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div
                key={img.componentId}
                className="rounded-xl border border-border overflow-hidden bg-bg-base"
              >
                <div className="aspect-video relative group">
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onImageClick(img.componentId)}
                      className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-[#0A0E1A] shadow-sm hover:bg-[#F0F4FF] transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {"\u66ff\u63db"}
                    </button>
                    <button
                      onClick={() => onImageReset(img.componentId)}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-[#FEE2E2] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#F87171]" />
                    </button>
                  </div>
                </div>
                <div className="px-2.5 py-1.5">
                  <p className="text-[10px] text-text-muted truncate">
                    {"\u5716\u7247"} {idx + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links & Buttons */}
      {links.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            {"連結設定"}
          </p>
          <div className="space-y-2.5">
            {links.map((link) => (
              <div key={link.componentId} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0",
                      link.isButton
                        ? "bg-accent/10 text-accent"
                        : "bg-bg-card-elevated text-text-muted"
                    )}
                  >
                    {link.isButton ? "按鈕" : "連結"}
                  </span>
                  <span className="text-xs text-text-primary truncate">
                    {link.text}
                  </span>
                </div>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => onLinkChange(link.componentId, e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-8 px-2 text-xs font-mono rounded-lg border border-border bg-bg-base text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Padding */}
      <div>
        <p className="text-xs font-semibold text-text-secondary mb-3">
          {"\u9593\u8ddd"}
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{"\u4e0a\u65b9"}</span>
              <span>{paddingTop}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={4}
              value={paddingTop}
              onChange={(e) => onPaddingChange("top", Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-border accent-accent cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{"\u4e0b\u65b9"}</span>
              <span>{paddingBottom}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={4}
              value={paddingBottom}
              onChange={(e) =>
                onPaddingChange("bottom", Number(e.target.value))
              }
              className="w-full h-1.5 rounded-full appearance-none bg-border accent-accent cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
