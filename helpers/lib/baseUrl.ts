const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_DEFAULT_APP_URL;
export default baseUrl;
