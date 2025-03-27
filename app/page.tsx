"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [images, setImages] = useState<{
    desktop?: string;
    tablet?: string;
    mobile?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const captureScreenshot = async () => {
    if (!url) return;
    setLoading(true);
    setImages({});

    const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    setImages(data);
    setLoading(false);
  };

  const downloadImage = (src: string, device: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `screenshot-${device}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Website Full Screenshot</h1>
      <input
        className="border p-2 rounded w-80 mb-4"
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={captureScreenshot}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? "Capturing..." : "Capture Full Page Screenshot"}
      </button>

      {loading && (
        <p className="text-gray-500">Please wait, capturing screenshot...</p>
      )}

      {images.desktop && (
        <div className="mt-4 flex flex-col gap-6">
          {/* ปุ่มดาวน์โหลดอยู่ด้านบน */}
          <div className="flex gap-4">
            {Object.entries(images).map(([device, src]) => (
              <button
                key={device}
                onClick={() => downloadImage(src, device)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Download {device}
              </button>
            ))}
          </div>

          {/* แสดงรูปตัวอย่าง */}
          {Object.entries(images).map(([device, src]) => (
            <div key={device} className="border p-2 rounded w-full text-center">
              <h2 className="font-semibold">{device.toUpperCase()}</h2>
              <img
                src={src}
                alt={`${device} screenshot`}
                className="w-1/3 mt-2 cursor-pointer border border-gray-300"
                onClick={() => setSelectedImage(src)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal สำหรับแสดงภาพเต็ม */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full Screenshot"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
}
