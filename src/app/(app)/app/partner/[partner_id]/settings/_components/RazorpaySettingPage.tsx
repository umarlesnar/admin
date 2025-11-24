import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import GoogleSettingsForm from "./GoogleSettingsForm";
import FacebookSettingsForm from "./FacebookSettingForm";
import RazorpaySettingsForm from "./RazorpaySettingForm";

const RazorpaySettingPage = () => {
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full ">
        <CardContent className="space-y-2 px-4 pt-4 pb-4">
          <RazorpaySettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RazorpaySettingPage;
