import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectDb from "@/db/connectDb";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectDb();

      const currentUser = await User.findOne({ email: user.email });
      if (!currentUser) {
        await User.create({
          email: user.email,
          username: user.email.split("@")[0],
        });
      }

      return true; // ✅ Allow login for all providers
    },

    async session({ session, user, token }) {
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.name = dbUser.username;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
