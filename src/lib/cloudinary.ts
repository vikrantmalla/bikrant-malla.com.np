import { Environment } from "@/types/enum";

// Cloudinary Configuration based on environment
export const cloudinaryConfig = {
  // Upload preset - use different presets for dev/prod if needed
  uploadPreset:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PROD
      : process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_DEV,

  // Cloud name - can be different for dev/prod
  cloudName:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_PROD
      : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_DEV,

  // API Key for signed uploads (optional)
  apiKey:
    process.env.NODE_ENV === Environment.PRODUCTION
      ? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_PROD
      : process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_DEV,

  // Upload mode: 'unsigned' or 'signed'
  uploadMode: "unsigned" as "unsigned" | "signed",

  // Upload options for single image
  uploadOptions: {
    maxFiles: 1,
    resourceType: "image",
    clientAllowedFormats: ["jpg", "jpeg", "png"],
    maxFileSize: 10000000, // 10MB
  },
};

// Validation function to check if Cloudinary is properly configured
export const validateCloudinaryConfig = () => {
  const issues = [];
  const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;
  const envLabel = isProduction ? "production" : "development";

  if (!cloudinaryConfig.uploadPreset) {
    issues.push(
      `Cloudinary upload preset is not set for ${envLabel} environment`
    );
  }

  if (!cloudinaryConfig.cloudName) {
    issues.push(`Cloudinary cloud name is not set for ${envLabel} environment`);
  }

  // Check if using signed uploads and have API key
  if (cloudinaryConfig.uploadMode === "signed" && !cloudinaryConfig.apiKey) {
    issues.push(
      `Cloudinary API key is required for signed uploads in ${envLabel} environment`
    );
  }

  return {
    isValid: issues.length === 0,
    issues,
    environment: envLabel,
    config: {
      uploadPreset: cloudinaryConfig.uploadPreset,
      cloudName: cloudinaryConfig.cloudName,
      uploadMode: cloudinaryConfig.uploadMode,
    },
  };
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  return `${baseUrl}/${publicId}`;
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      return urlParts
        .slice(uploadIndex + 2)
        .join("/")
        .split(".")[0];
    }
    return url;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return url;
  }
};
