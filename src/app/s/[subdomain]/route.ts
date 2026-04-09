import { createClient } from "@supabase/supabase-js";
import { generateStaticHTML } from "@/lib/html-generator";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return new NextResponse("Server configuration error", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const supabase = createClient(url, key);
  const { subdomain } = await params;

  const { data: site } = await supabase
    .from("sites")
    .select("id, name, published")
    .eq("subdomain", subdomain)
    .eq("published", true)
    .single();

  if (!site) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title></head>
       <body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#F8F9FC;color:#0A0E1A;">
       <div style="text-align:center"><h1 style="font-size:48px;margin:0;">404</h1><p style="color:#4A5568;margin-top:8px;">找不到此網站</p></div></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const { data: pages } = await supabase
    .from("pages")
    .select("title, slug, content_json")
    .eq("site_id", site.id)
    .order("created_at", { ascending: true });

  if (!pages || pages.length === 0) {
    return new NextResponse("No pages found", { status: 404 });
  }

  const page = pages[0];
  const content = (page.content_json || {}) as Record<string, string>;

  const fullHtml = generateStaticHTML(
    { title: page.title, html: content.html || "", css: content.css || "" },
    site.name
  );

  return new NextResponse(fullHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
