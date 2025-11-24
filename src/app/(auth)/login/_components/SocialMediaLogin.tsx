"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon";
import { signIn } from "next-auth/react";
import React from "react";

type Props = {};

const SocialMediaLogin = (props: Props) => {
  const onSocialMediaLogin = async (platform: string) => {
    try {
      const response = await signIn(platform);
    } catch (error) {}
  };

  return (
    <div className="mt-1 grid grid-cols-1 gap-3 w-full">
      <div className="w-full">
        <Button
          leftIcon={<GoogleIcon className="mr-3 w-6 h-6" />}
          className="w-full h-10"
          variant="outline"
          onClick={() => {
            onSocialMediaLogin("google");
          }}
        >
          Sign in with Google
        </Button>
      </div>

      {/* <div>
        <Button
          leftIcon={<FacebookIcon className="mr-2 w-6 h-6 text-blue-500" />}
          className="w-full"
          variant="outline"
          onClick={() => {
            onSocialMediaLogin("facebook");
          }}
        >
          Facebook
        </Button>
      </div> */}
    </div>
  );
};

export default SocialMediaLogin;
