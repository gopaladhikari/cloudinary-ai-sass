const {
  CLOUDINARY_API_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

export const env = {
  cloudinaryApiName: String(CLOUDINARY_API_NAME),
  cloudinaryApiKey: String(CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(CLOUDINARY_API_SECRET),
} as const;
