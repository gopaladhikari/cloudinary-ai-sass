const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const cloudinaryApiName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const env = {
  cloudinaryApiName: String(cloudinaryApiName),
  cloudinaryApiKey: String(CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(CLOUDINARY_API_SECRET),
} as const;
