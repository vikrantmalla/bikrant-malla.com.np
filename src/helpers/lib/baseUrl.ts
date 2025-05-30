import { Environment } from "@/types/enum";

export const baseUrl =
  process.env.NODE_ENV === Environment.PRODUCTION
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_DEFAULT_APP_URL;

export const dataBaseUrl =
  process.env.NODE_ENV === Environment.PRODUCTION
    ? process.env.DB_PROD_MONGODB_URI
    : process.env.DB_DEV_MONGODB_URI;
