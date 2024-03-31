import { z } from "zod";

const envVariables = z.object({
  MONGODB_URI: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEFAULT_APP_URL: z.string().url(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string(),
  NEXT_PUBLIC_GOOGLE_SITE_ID: z.string(),
  NEXT_PUBLIC_MICROSOFT_CLARITY: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  TOKEN_SECRET: z.string(),
  TRANSPORT_HOST: z.string(),
  TRANSPORT_USER: z.string(),
  TRANSPORT_PASS: z.string(),
  MAILER: z.string().email(),
});

const {
  MONGODB_URI,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_APP_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_GOOGLE_SITE_ID,
  NEXT_PUBLIC_MICROSOFT_CLARITY,
  NEXT_PUBLIC_SENTRY_DSN,
  TOKEN_SECRET,
  TRANSPORT_HOST,
  TRANSPORT_USER,
  TRANSPORT_PASS,
  MAILER,
} = process.env;

const parsedResult = envVariables.safeParse({
  MONGODB_URI,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_DEFAULT_APP_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS,
  NEXT_PUBLIC_GOOGLE_SITE_ID,
  NEXT_PUBLIC_MICROSOFT_CLARITY,
  NEXT_PUBLIC_SENTRY_DSN,
  TOKEN_SECRET,
  TRANSPORT_HOST,
  TRANSPORT_USER,
  TRANSPORT_PASS,
  MAILER,
});

if (!parsedResult.success) {
  throw new Error("There is an error with the environment variables");
}

export const enviromentVariables = parsedResult.data;

type EnvVarSchemaType = z.infer<typeof envVariables>

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
