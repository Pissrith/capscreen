import puppeteer from "puppeteer-core";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  console.log("Processing URL:", url);

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint:
        "wss://browserless-ro4gw0sk8oo0c00o484ocsgg.m3ow.xyz?token=xO4tR3U5bYR29R9TUU7FlvyDZlu4eiDK",
    });
    const page = await browser.newPage();

    const sizes = {
      desktop: { width: 1280, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 667 },
    };

    const screenshots: Record<string, string> = {};

    for (const [device, size] of Object.entries(sizes)) {
      await page.setViewport(size);
      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshot = await page.screenshot({
        encoding: "base64",
        fullPage: true,
      });
      screenshots[device] = `data:image/png;base64,${screenshot}`;
    }

    await browser.close();

    console.log("Screenshots captured:", Object.keys(screenshots)); // เช็คว่ามีภาพจริง
    return NextResponse.json(screenshots);
  } catch (error) {
    console.error("Puppeteer Error:", error);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
