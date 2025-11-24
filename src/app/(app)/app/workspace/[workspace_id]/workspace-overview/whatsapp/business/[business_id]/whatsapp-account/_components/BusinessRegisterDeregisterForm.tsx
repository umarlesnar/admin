import { Button } from "@/components/ui/button";
import { useBusinessRegisterUpdateMutation } from "@/framework/business/whatsapp/business-registration-mutation";
import { useBusinessDeregisterMutation } from "@/framework/business/whatsapp/deregister-mutation";
import React from "react";
import { toast } from "sonner";

type Props = {};

const BusinessRegisterDeregisterForm = (props: Props) => {
  const registerMutation = useBusinessRegisterUpdateMutation();
  const deregisterMutation = useBusinessDeregisterMutation();

  const handleRegister = async () => {
    const loadingToast = toast.loading("Registering Whatsapp...");
    try {
      await registerMutation.mutateAsync();
      toast.success("Whatsapp Registered Successfully", { id: loadingToast });
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Failed to register whatsapp", { id: loadingToast });
    }
  };

  const handleDeregister = async () => {
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
      <Button
        onClick={handleRegister}
        disabled={
          //@ts-ignore
          registerMutation.isLoading
        }
      >
        {
          //@ts-ignore
          registerMutation.isLoading ? "Registering..." : "Register"
        }
      </Button>

      <Button
        variant="destructive"
        onClick={handleDeregister}
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
