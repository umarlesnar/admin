import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import CloudProviderForm from "./CloudProviderCard";
import AccountStatusCard from "./AccountStatusCard";
import BroadcastLimitCard from "./BroadcastLimitCard";

const SettingsCardsList = () => {
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full pb-4">
        <CardHeader className="space-y-3">
          <CardTitle className="text-text-primary">
            {`Cloud Provider`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4">
          <CloudProviderForm />
        </CardContent>
      </Card>
      <Card className="w-full h-full pb-4">
        <CardHeader className="space-y-3">
          <CardTitle className="text-text-primary">
            {`Account Status`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4">
          <AccountStatusCard />
        </CardContent>
      </Card>
      <Card className="w-full h-full pb-4">
        <CardHeader className="space-y-3">
          <CardTitle className="text-text-primary">
            {`Broadcast Limit`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4">
          <BroadcastLimitCard />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsCardsList;
