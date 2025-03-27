"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2Icon, DownloadIcon } from "lucide-react";

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
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Website Full Screenshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={captureScreenshot}
              disabled={loading || !url}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Capturing...
                </>
              ) : (
                "Capture Full Page Screenshot"
              )}
            </Button>

            {images.desktop && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(images).map(([device, src]) => (
                  <div key={device} className="text-center space-y-2">
                    <h2 className="font-semibold">{device.toUpperCase()}</h2>
                    <div
                      className="w-full h-48 overflow-hidden rounded-md cursor-pointer"
                      onClick={() => setSelectedImage(src)}
                    >
                      <img
                        src={src}
                        alt={`${device} screenshot`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(src, device)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Screenshot"
              className="w-full max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
