// lib/next-auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./utils/mongoose/dbConnect";
import bcrypt from "bcryptjs";
import axios from "axios";
import adminUserAccountSchema from "@/models/admin-user-account-schema";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// Helper function to verify Google reCAPTCHA
const verifyGoogleCaptcha = async (
  secret_key: string,
  captchaToken: string
) => {
  try {
    let captchaValidation = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captchaToken}`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );

    return captchaValidation.data.success;
  } catch (error) {
    console.error("Captcha verification error:", error);
    return false;
  }
};

// Helper function to format user response
const formatUserResponse = (user: any) => {
  if (!user) return null;

  try {
    return {
      user_id: user._id.toString(),
      sub: user._id.toString(),
      email: user.username || user.email,
      name: user.profile?.first_name || "",
      role: user.role || "user",
      profile: {
        first_name: user.profile?.first_name || "",
        last_name: user.profile?.last_name || "",
        image: user.profile?.image || null,
        full_name: `${user.profile?.first_name || ""} ${
          user.profile?.last_name || ""
        }`.trim(),
      },
      auth_type: user.auth_type || 1,
    };
  } catch (error) {
    console.error("Error formatting user response:", error);
    return null;
  }
};

export const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1800, // 30 minutes
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        captchaCode: { label: "Captcha", type: "text" },
      },
      //@ts-ignore
      async authorize(credentials: any, req) {
        await dbConnect();

        const gCaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (gCaptchaSecretKey) {
          if (!credentials?.captchaCode) {
            throw new Error("Please complete the captcha");
          }

          const g_response = await verifyGoogleCaptcha(
            gCaptchaSecretKey,
            credentials?.captchaCode
          );
          if (!g_response) {
            throw new Error("Invalid captcha");
          }
        }

        try {
          const user = await adminUserAccountSchema.findOne({
            auth_type: 1,
            username: credentials.username,
            status: "ACTIVE",
          });

          console.log(
            "Found user:",
            user.auth_credentials?.password || "",
            credentials.password
          );

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const compare = await bcrypt.compare(
            credentials.password,
            user.auth_credentials?.password || ""
          );

          if (!compare) {
            throw new Error("Invalid credentials");
          }

          return formatUserResponse(user);
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google" && profile?.email) {
        await dbConnect();
        try {
          const existingUser = await adminUserAccountSchema
            .findOne({
              auth_type: 3,
              username: profile.email,
              status: "ACTIVE",
            })
            .lean();

          if (!existingUser) {
            return false;
          }

          const formattedUser = formatUserResponse(existingUser);
          if (!formattedUser) {
            return false;
          }

          Object.assign(user, formattedUser);
          return true;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle error cases
      if (url.includes("error") || url.includes("signin")) {
        return `${baseUrl}/login`;
      }

      // Handle successful sign in
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default redirect
      return `${baseUrl}/login`;
    },
  },
};
