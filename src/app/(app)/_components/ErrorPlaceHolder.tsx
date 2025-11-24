import React from "react";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ErrorPlaceholder = () => {
  return (
    <div className="max-w-md p-6 flex flex-col gap-2 items-center">
      <div className="h-32 w-32 relative mb-3">
        <img
          src="/assets/images/error.svg"
          alt="OOPS! We’re getting Error:500!"
          className="rounded-lg h-32 w-32 object-cover"
        />
      </div>
      <div className="text-center w-[100%] mb-3">
        <Text className="pb-2" size="xl" color="secondary" weight="bold">
          OOPS! We’re getting Error:500!
        </Text>
        <Text size="sm" weight="regular" color="teritary">
          Something went wrong and we are working on it Try again soon or
          contact our support team if you need immediate help.
        </Text>
      </div>
      <Button
        variant="outline"
        className="md-w-[30%] text-primary bg-primary-50 font-semibold border border-none"
      >
        Get Support
      </Button>
    </div>
  );
};

export default ErrorPlaceholder;
