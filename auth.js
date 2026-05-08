import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import connectDB from "@/config/db";
import User from "@/models/user";
import bcryptjs from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          await connectDB();

          const user = await User.findById(credentials.email);
          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordValid = await bcryptjs.compare(credentials.password, user.passwordHash);
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.imageUrl,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Only sync with DB for OAuth providers
        if (account?.provider !== "credentials") {
          let existingUser = await User.findById(user.email);

          if (!existingUser) {
            const newUser = new User({
              _id: user.email,
              name: user.name || profile?.name || "",
              email: user.email,
              imageUrl: user.image || profile?.image || "",
              role: "user",
              cartItems: {},
            });
            await newUser.save();
          } else {
            if (user.image && existingUser.imageUrl !== user.image) {
              existingUser.imageUrl = user.image;
              await existingUser.save();
            }
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

