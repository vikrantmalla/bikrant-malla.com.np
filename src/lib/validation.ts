import { z } from "zod";
import { Platform, Role } from "@/types/enum";

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase();
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
export const uuidSchema = z.string().uuid("Invalid UUID format");

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name is required").max(100).optional(),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  subTitle: z.string().max(200).trim().optional(),
  images: z.string().url("Invalid image URL").optional(),
  alt: z.string().max(200).trim().optional(),
  projectView: z
    .string()
    .url("Invalid project URL")
    .min(1, "Project URL is required"),
  tools: z.array(z.string()).min(1, "At least one tool is required"),
  platform: z.nativeEnum(Platform),
  portfolioId: uuidSchema,
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  subTitle: z.string().max(200).trim().optional(),
  images: z.string().url("Invalid image URL").optional(),
  alt: z.string().max(200).trim().optional(),
  projectView: z
    .string()
    .url("Invalid project URL")
    .min(1, "Project URL is required"),
  tools: z.array(z.string()).min(1, "At least one tool is required"),
  platform: z.nativeEnum(Platform),
});

// Portfolio schemas
export const createPortfolioSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  jobTitle: z.string().min(1, "Job title is required").max(100).trim(),
  aboutDescription1: z
    .string()
    .min(1, "About description is required")
    .max(1000)
    .trim(),
  aboutDescription2: z.string().max(1000).trim().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  ownerEmail: emailSchema,
  linkedIn: z.string().url("Invalid LinkedIn URL").optional(),
  gitHub: z.string().url("Invalid GitHub URL").optional(),
  behance: z.string().url("Invalid Behance URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

// Tech tag schemas
export const createTechTagSchema = z.object({
  tag: z.string().min(1, "Tag name is required").max(50).trim(),
});

export const bulkCreateTechTagsSchema = z.object({
  tags: z
    .array(z.string().min(1, "Tag name is required").max(50).trim())
    .min(1, "At least one tag is required"),
});

// Tech option schemas
export const createTechOptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  category: z.string().min(1, "Category is required").max(50).trim(),
  description: z.string().max(500).trim().optional(),
  isActive: z.boolean().default(true),
});

// Invite schema
export const inviteUserSchema = z.object({
  email: emailSchema,
  role: z.nativeEnum(Role),
});

// Config schema
export const updateConfigSchema = z.object({
  maxWebProjects: z.number().int().min(1).max(100),
  maxDesignProjects: z.number().int().min(1).max(100),
  maxTotalProjects: z.number().int().min(1).max(200),
});

// Archive project schemas
export const createArchiveProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).trim(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  isNew: z.boolean().default(false),
  projectView: z
    .string()
    .url("Invalid project URL")
    .min(1, "Project URL is required"),
  viewCode: z.string().url("Invalid code URL").min(1, "Code URL is required"),
  build: z.array(z.string()).default([]),
  portfolioId: uuidSchema,
});

export const updateArchiveProjectSchema = createArchiveProjectSchema
  .partial()
  .omit({ portfolioId: true });

// Request validation helper
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Request size validation
export function validateRequestSize(
  request: Request,
  maxSize: number = 1024 * 1024
): boolean {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > maxSize) {
    return false;
  }
  return true;
}
