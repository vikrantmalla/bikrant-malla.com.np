// imports
import NextAuth from "next-auth";
import dbConnect from "@/helpers/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/helpers/models/User";
import bcrypt from "bcryptjs";
import { Message } from "@/types/enum";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error(Message.NO_USER_FOUND);
          }

          if (!user.isVerified) {
            throw new Error(Message.VERIFY_EMAIL);
          }

          if (user) {
            const validPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (validPassword) {
              return user;
            } else {
              throw new Error(Message.INVALID_PASSWORD);
            }
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user }) {
      if(user) {
        token._id = user._id?.toString();
        token.isVerifed = user.isVerified;
      }
      return token;
    },
    async session({ session, user, token }) {
      if(user) {
        session.user._id = token.id;
        session.user.isVerifed = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
});

export { handler as GET, handler as POST };
