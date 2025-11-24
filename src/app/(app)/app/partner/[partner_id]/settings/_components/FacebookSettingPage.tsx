import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import FacebookSettingsForm from "./FacebookSettingForm";
import FacebookBusinessSettingsForm from "./FacebookBusinessForm";
import FacebookClientSettingsForm from "./FacebookClientForm";
import FacebookSdkSettingsForm from "./FacebookSdkForm";
import SystemSettingsForm from "./SystemSettingForm";

const FacebookSettingPage = () => {
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full ">
        <CardContent className="space-y-6 px-4 pt-4 pb-4">
          <FacebookSettingsForm />
        </CardContent>
      </Card>
      <Card className="w-full h-full ">
        <CardContent className="space-y-2 px-4 pt-6 pb-4">
          <SystemSettingsForm />
        </CardContent>
      </Card>
      {/* <Card className="w-full h-full ">
        <CardContent className="space-y-2 px-4 pt-4 pb-4">
          <FacebookBusinessSettingsForm />
        </CardContent>
      </Card>
      <Card className="w-full h-full ">
        <CardContent className="space-y-2 px-4 pt-4 pb-4">
          <FacebookClientSettingsForm />
        </CardContent>
      </Card>
      <Card className="w-full h-full ">
        <CardContent className="space-y-2 px-4 pt-4 pb-4">
          <FacebookSdkSettingsForm />
        </CardContent>
      </Card> */}
    </div>
  );
};

export default FacebookSettingPage;
