import { NextApiRequest } from "next";
import React, { ReactNode } from "react";

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET: string;
      MONGODB_URI: string;
      NEXTAUTH_URL?: string;
      FACEBOOK_CLIENT_ID?: string;
      FACEBOOK_CLIENT_SECRET?: string;
    }
  }
}