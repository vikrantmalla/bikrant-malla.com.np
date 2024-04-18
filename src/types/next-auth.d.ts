import "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    isVerified: boolean;
  }

  interface Session {
    user: {
      _id: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    _id: string;
    isVerified: boolean;
  }
}
