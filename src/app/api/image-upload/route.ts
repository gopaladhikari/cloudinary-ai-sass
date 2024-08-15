import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/config/env";

cloudinary.config({
  cloud_name: env.cloudinaryApiName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

interface UploadSream {
  public_id: string;
}

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId)
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );

  const formData = await req.formData();

  const image = formData.get("image") as File | null;

  if (!image)
    return NextResponse.json(
      { error: "No image provided" },
      { status: 400 }
    );

  const bytes = await image.arrayBuffer();

  const buffer = Buffer.from(bytes);

  try {
    const response = await new Promise<UploadSream>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cloudinary-ai/images",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadSream);
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        pulic_id: response.public_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
