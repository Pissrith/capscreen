"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [images, setImages] = useState<{
    desktop?: string;
    tablet?: string;
    mobile?: string;
  }>({});

  const captureScreenshot = async () => {
    if (!url) return;
    const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setImages(data);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Website Screenshot</h1>
      <input
        className="border p-2 rounded w-80 mb-4"
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={captureScreenshot}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Capture Screenshot
      </button>

      {images.desktop && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(images).map(([device, src]) => (
            <div key={device} className="border p-2 rounded">
              <h2 className="text-center font-semibold">
                {device.toUpperCase()}
              </h2>
              <img
                src={src}
                alt={`${device} screenshot`}
                className="w-full mt-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
