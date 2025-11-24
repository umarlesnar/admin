import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import BrandSettingsForm from "./BrandSettingForm";
import EmailSettingsForm from "./EmailSettingForm";

const EmailSettingPage = () => {
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full ">
        <CardTitle className="px-4 pt-4 pb-4 text-xl text-neutral-700 font-semibold">
          SMTP Config
        </CardTitle>
        <CardContent className="space-y-2 px-4 pb-4">
          <EmailSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettingPage;
