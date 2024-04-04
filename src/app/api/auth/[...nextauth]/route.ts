// imports
import NextAuth from "next-auth";
import dbConnect from "@/helpers/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/helpers/models/User";
import bcrypt from "bcryptjs";

dbConnect();
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await User.findOne({ email: credentials?.email });
          if (user) {
            const validPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (validPassword) {
              return user;
            }
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
