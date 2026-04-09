import "grapesjs/dist/css/grapes.min.css";
import "./editor-overrides.css";

export const metadata = {
  title: "SiteForge Editor",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
