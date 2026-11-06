import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ratios = ["1:1", "4:5", "3:2", "16:9", "9:16"] as const;
type Ratio = typeof ratios[number];

const imageSize: Record<Ratio, string> = {
  "1:1": "square_hd",
  "4:5": "portrait_4_3",
  "3:2": "landscape_4_3",
  "16:9": "landscape_4_3",
  "9:16": "portrait_4_3"
};

export async function POST(request: NextRequest) {
  try {
    const key = process.env.FAL_KEY;
    if (!key) {
      return NextResponse.json({ error: "Image generation is not configured yet. Add FAL_KEY to your environment variables." }, { status: 503 });
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const ratio = ratios.includes(body.ratio) ? body.ratio as Ratio : "1:1";
    const count = Math.min(4, Math.max(1, Number(body.count) || 1));

    if (prompt.length < 3) {
      return NextResponse.json({ error: "Please enter a prompt with at least 3 characters." }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt must be 2,000 characters or fewer." }, { status: 400 });
    }

    const response = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        image_size: imageSize[ratio],
        num_images: count,
        output_format: "png",
        enable_safety_checker: true
      }),
      signal: AbortSignal.timeout(55000)
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data?.detail || data?.message || "The image provider could not complete this request." }, { status: response.status });
    }

    const images = Array.isArray(data.images) ? data.images.map((item: { url?: string }) => item.url).filter(Boolean) : [];
    if (!images.length) {
      return NextResponse.json({ error: "The provider returned no images. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ images, seed: data.seed ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message.includes("timeout") ? "Generation took too long. Please try again." : "Something went wrong while generating your images." }, { status: 500 });
  }
}