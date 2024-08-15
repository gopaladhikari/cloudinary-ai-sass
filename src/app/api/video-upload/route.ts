import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/config/env";
import { prisma } from "../../../../prisma";

cloudinary.config({
  cloud_name: env.cloudinaryApiName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

interface UploadSream {
  public_id: string;
  duration?: number;
  bytes: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId)
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );

  const formData = await req.formData();

  const video = formData.get("video") as File | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const originalSize = formData.get("originalSize") as string;

  if (!video)
    return NextResponse.json(
      { error: "No video provided" },
      { status: 400 }
    );

  const bytes = await video.arrayBuffer();

  const buffer = Buffer.from(bytes);

  try {
    const response = await new Promise<UploadSream>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cloudinary-ai/videos",
            resource_type: "video",
            transformation: [
              {
                quality: "auto",
                fetch_format: "mp4",
              },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else {
              if (!result) reject("No result");
              resolve(result as UploadSream);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    console.log("response", response);

    const videoDb = prisma.video.create({
      data: {
        title,
        description,
        publicId: response.public_id,
        originalSize,
        duration: response.duration || 0,
        compressedSize: response.bytes,
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
