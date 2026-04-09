import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { siteId } = await request.json();
    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId)
      .eq("user_id", user.id)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const { data: pages, error: pagesError } = await supabase
      .from("pages")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: true });

    if (pagesError || !pages || pages.length === 0) {
      return NextResponse.json({ error: "No pages found" }, { status: 400 });
    }

    const { data: deployment, error: deployError } = await supabase
      .from("deployments")
      .insert({
        site_id: siteId,
        status: "building",
      })
      .select()
      .single();

    if (deployError) {
      console.error("Deploy insert error:", deployError);
      return NextResponse.json({ error: `Deploy record failed: ${deployError.message}` }, { status: 500 });
    }

    try {
      const origin = new URL(request.url).origin;
      const previewUrl = `${origin}/s/${site.subdomain}`;

      await supabase
        .from("deployments")
        .update({
          status: "success",
          preview_url: previewUrl,
        })
        .eq("id", deployment.id);

      await supabase
        .from("sites")
        .update({ published: true })
        .eq("id", siteId);

      await supabase
        .from("pages")
        .update({ published_at: new Date().toISOString() })
        .eq("site_id", siteId);

      return NextResponse.json({
        success: true,
        url: previewUrl,
        deploymentId: deployment.id,
      });
    } catch (buildError) {
      const errorMessage =
        buildError instanceof Error ? buildError.message : "Unknown build error";

      await supabase
        .from("deployments")
        .update({
          status: "failed",
          error_log: errorMessage,
        })
        .eq("id", deployment.id);

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
