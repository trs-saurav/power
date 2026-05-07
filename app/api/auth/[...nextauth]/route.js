import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/config/db";
import User from "@/models/user";
import bcryptjs from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
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
            id: user._id,
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
  pages: {
    signIn: "/sign-in",
    forgotPassword: "/auth/forgot-password",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      return session;
    },
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
