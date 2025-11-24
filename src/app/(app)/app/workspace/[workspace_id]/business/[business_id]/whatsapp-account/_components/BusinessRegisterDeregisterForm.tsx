import { Button } from "@/components/ui/button";
import { useBusinessRegisterUpdateMutation } from "@/framework/business/whatsapp/business-registration-mutation";
import { useBusinessDeregisterMutation } from "@/framework/business/whatsapp/deregister-mutation";
import React from "react";
import { toast } from "sonner";
import SentOtpButtonModel from "./SentOtpButtonModel";

type Props = {};

const BusinessRegisterDeregisterForm = (props: Props) => {
  // const registerMutation = useBusinessRegisterUpdateMutation();
  const deregisterMutation = useBusinessDeregisterMutation();

  // const handleRegister = async (e?: React.MouseEvent) => {
  //   e?.preventDefault();
  //   const loadingToast = toast.loading("Registering Whatsapp...");
  //   try {
  //     await registerMutation.mutateAsync();
  //     toast.success("Whatsapp Registered Successfully", { id: loadingToast });
  //   } catch (error) {
  //     console.error("Register error:", error);
  //     toast.error("Failed to register whatsapp", { id: loadingToast });
  //   }
  // };

  const handleDeregister = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const loadingToast = toast.loading("Deregistering Whatsapp...");
    try {
      await deregisterMutation.mutateAsync();
      toast.success("Whatsapp Deregistered Successfully", { id: loadingToast });
    } catch (error) {
      console.error("Deregister error:", error);
      toast.error("Failed to deregister whatsapp", { id: loadingToast });
    }
  };

  return (
    <div className="pb-5 flex items-center gap-4">
      <SentOtpButtonModel>
        <Button type="button">Register</Button>
      </SentOtpButtonModel>

      <Button
        type="button"
        variant="destructive"
        onClick={(e) => handleDeregister(e)}
        disabled={
          //@ts-ignore
          deregisterMutation.isLoading
        }
      >
        {
          //@ts-ignore
          deregisterMutation.isLoading ? "Deregistering..." : "Deregister"
        }
      </Button>
    </div>
  );
};

export default BusinessRegisterDeregisterForm;
