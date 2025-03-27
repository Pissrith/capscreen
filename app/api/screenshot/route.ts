// src/app/api/screenshot/route.ts
import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const browser = await puppeteer.launch({ headless: true });
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

    // 📌 ถ่ายภาพเต็มหน้า
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: true,
    });

    screenshots[device] = `data:image/png;base64,${screenshot}`;
  }

  await browser.close();
  return NextResponse.json(screenshots);
}
