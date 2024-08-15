"use client";

import { CldImage } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";

const socialFormat = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:75)": {
    width: 820,
    height: 312,
    aspectRatio: "205:75",
  },
};

type SocialFormat = keyof typeof socialFormat;

export default function Page() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransitioning(true);
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setUploadedImage(data.pulic_id);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsUploading(false);
      setIsTransitioning(false);
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };

  return (
    <main>
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Social Media Image Creator
        </h1>

        <div className="card">
          <div className="card-body">
            <h2 className="card-title mb-4">Upload an Image</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Choose an image file
                </span>
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="file-input file-input-bordered file-input-primary w-full"
              />
            </div>

            {isUploading && (
              <div className="mt-4">
                <progress className="progress progress-primary w-full" />
              </div>
            )}

            {uploadedImage && (
              <div className="mt-6">
                <h2 className="card-title mb-4">
                  Select Social Media Format
                </h2>
                <div className="form-control">
                  <select
                    className="select select-bordered w-full"
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectedFormat(
                        e.target.value as SocialFormat
                      )
                    }
                  >
                    {Object.keys(socialFormat).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative mt-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    Preview:
                  </h3>
                  <div className="flex justify-center">
                    {isTransitioning && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100 bg-opacity-50">
                        <span className="loading loading-spinner loading-lg" />
                      </div>
                    )}
                    <CldImage
                      width={socialFormat[selectedFormat].width}
                      height={socialFormat[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={
                        socialFormat[selectedFormat].aspectRatio
                      }
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransitioning(false)}
                    />
                  </div>
                </div>

                <div className="card-actions mt-6 justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleDownload}
                  >
                    Download for {selectedFormat}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
