import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  DB_PROD_MONGODB_URI: z.string().optional(),
  DB_DEV_MONGODB_URI: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEFAULT_APP_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string(),
  NEXT_PUBLIC_GOOGLE_SITE_ID: z.string(),
  NEXT_PUBLIC_MICROSOFT_CLARITY: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  // JWT Configuration
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

const {
  DATABASE_URL,
  DB_PROD_MONGODB_URI,
  DB_DEV_MONGODB_URI,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_APP_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_GOOGLE_SITE_ID,
  NEXT_PUBLIC_MICROSOFT_CLARITY,
  NEXT_PUBLIC_SENTRY_DSN,
  // JWT Configuration
  JWT_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;

const parsedResult = envVariables.safeParse({
  DATABASE_URL,
  DB_PROD_MONGODB_URI,
  DB_DEV_MONGODB_URI,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_APP_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_GOOGLE_SITE_ID,
  NEXT_PUBLIC_MICROSOFT_CLARITY,
  NEXT_PUBLIC_SENTRY_DSN,
  // JWT Configuration
  JWT_SECRET,
  JWT_REFRESH_SECRET,
});

if (!parsedResult.success) {
  throw new Error("There is an error with the environment variables");
}

export const EnvironmentVariables = parsedResult.data;

type EnvVarSchemaType = z.infer<typeof envVariables>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
