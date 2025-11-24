import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import GoogleSettingsForm from "./GoogleSettingsForm";
import PaymentSettingsForm from "./PaymentSettingForm";

const PaymentSettingPage = () => {
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full">
        <CardContent className="space-y-2 px-4 pt-6 pb-4">
          <PaymentSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettingPage;
