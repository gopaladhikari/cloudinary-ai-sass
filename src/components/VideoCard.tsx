"use client";

import dayjs from "dayjs";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { useState, useEffect, useCallback } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@prisma/client";
import { Download, Clock, FileDown, FileUp } from "lucide-react";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload?: (url: string, title: string) => void;
}

export function VideoCard({ video, onDownload }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  const getThumbnailUrl = useCallback(
    (publicId: string) =>
      getCldImageUrl({
        src: publicId,
        width: 400,
        height: 225,
        crop: "fill",
        gravity: "auto",
        quality: "auto",
        assetType: "video",
      }),
    []
  );

  const getVideoUrl = useCallback(
    (publicId: string) =>
      getCldVideoUrl({
        src: publicId,
        width: 1920,
        height: 1080,
      }),
    []
  );

  const getPreviewUrl = useCallback(
    (publicId: string) =>
      getCldImageUrl({
        src: publicId,
        width: 400,
        height: 225,
        rawTransformations: [
          "e_preview:duration_25:max_seg_9:min_seg_dur_1",
        ],
      }),
    []
  );

  const fileFormatSize = useCallback(
    (size: number) => filesize(size),
    []
  );

  const fomratDuration = useCallback((duration: number) => {
    const minutes = Math.floor(duration / 60);
    const remaining = Math.round(duration % 60);

    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    1 - Number(video.compressedSize) / Number(video.originalSize)
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  return (
    <div>
      {" "}
      <div
        className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <figure className="relative aspect-video">
          {isHovered ? (
            previewError ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <p className="text-red-500">Preview not available</p>
              </div>
            ) : (
              <video
                src={getPreviewUrl(video.publicId)}
                autoPlay
                muted
                loop
                className="h-full w-full object-cover"
                onError={handlePreviewError}
              />
            )
          ) : (
            <img
              src={getThumbnailUrl(video.publicId)}
              alt={video.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute bottom-2 right-2 flex items-center rounded-lg bg-base-100 bg-opacity-70 px-2 py-1 text-sm">
            <Clock size={16} className="mr-1" />
            {fomratDuration(video.duration)}
          </div>
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-lg font-bold">
            {video.title}
          </h2>
          <p className="mb-4 text-sm text-base-content opacity-70">
            {video.description}
          </p>
          <p className="mb-4 text-sm text-base-content opacity-70">
            Uploaded {dayjs(video.createdAt).fromNow()}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <FileUp size={18} className="mr-2 text-primary" />
              <div>
                <div className="font-semibold">Original</div>
                <div>
                  {fileFormatSize(Number(video.originalSize))}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <FileDown size={18} className="mr-2 text-secondary" />
              <div>
                <div className="font-semibold">Compressed</div>
                <div>
                  {fileFormatSize(Number(video.compressedSize))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-semibold">
              Compression:{" "}
              <span className="text-accent">
                {compressionPercentage}%
              </span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                onDownload?.(getVideoUrl(video.publicId), video.title)
              }
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
