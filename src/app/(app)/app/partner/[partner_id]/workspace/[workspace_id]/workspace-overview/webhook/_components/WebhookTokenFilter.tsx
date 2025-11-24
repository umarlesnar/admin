import { Button } from "@/components/ui/button";
import DropdownTokenFilter from "@/components/ui/drop-down-token";
import React, { useEffect, useState } from "react";

export const WEBHOOK_FIELDS = [
  { label: "message/receiver", value: "message/receiver" },
  { label: "message/sender", value: "message/sender" },
];

type Props = {
  selectedTokens: string[];
  onTokenSelect: (array: string[]) => void;
};

const WebhookTokenFilter = ({ selectedTokens, onTokenSelect }: Props) => {
  const [options, setOptions] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    setOptions(
      WEBHOOK_FIELDS.map((field) => ({
        name: field.label,
        value: field.value,
      }))
    );
  }, []);

  const handleSelect = (array: string[]) => {
    onTokenSelect(array);
  };

  return (
    <DropdownTokenFilter
      label={`Webhook Events selected`}
      options={options}
      selectedOptions={selectedTokens}
      onSelectData={handleSelect}
    >
      {selectedTokens.length > 0 ? (
        <Button variant="outline" className="w-[448px] flex justify-start">
           {selectedTokens.length} Events Selected
        </Button>
      ) : (
        <Button variant="outline" className="w-[448px] flex justify-start">Select Webhook Events</Button>
      )}
    </DropdownTokenFilter>
  );
};

export default WebhookTokenFilter;

