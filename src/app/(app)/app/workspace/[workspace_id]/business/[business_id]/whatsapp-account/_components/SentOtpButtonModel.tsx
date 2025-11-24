import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import Text from "@/components/ui/text";
import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Make sure you have this component
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/framework/business/whatsapp/phone-numbers/verify-otp-mutation";
import { useRequestOtpCodeMutation } from "@/framework/business/whatsapp/phone-numbers/request-otp-mutation";

type Props = {
  children?: React.ReactNode;
};

const SentOtpButtonModel = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const { mutate: verifyOtp, isPending: isVerifyOtp } = useVerifyOtpMutation();
  const { mutate: requestOtpCode, isPending: isSendingOtp } =
    useRequestOtpCodeMutation();

  const handleSendOtp = () => {
    requestOtpCode(undefined, {
      onSuccess: () => {
        toast.success("OTP Sent Successfully");
        setOtpSent(true);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to send OTP");
        setOtpSent(false);
      },
    });
  };

  const handleVerifyOtp = () => {
    if (!otpValue) return toast.error("Please enter OTP");
    verifyOtp(otpValue, {
      onSuccess: () => {
        toast.success("OTP Verified Successfully");
        setOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Verification failed");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setOtpSent(false);
          setOtpValue("");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-row items-center justify-between border-b border-neutral-60 ">
          <DialogTitle>
            <Text size="xl" weight="semibold" className="pb-2">
              Phone Number Verification
            </Text>
          </DialogTitle>
          <CloseIcon
            className="w-4 h-4 text-icon-primary cursor-pointer mb-1"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="w-full px-2 space-y-4">
          {!otpSent ? (
            <>
              <Text size="sm" color="primary">
                We will now send a one-time password (OTP) to the WhatsApp phone
                number associated with your business account. Do you want to
                proceed?
              </Text>
              <Button
                type="button"
                className="w-full"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
              />
              <Button
                type="button"
                className="w-full"
                onClick={handleVerifyOtp}
              >
                {isVerifyOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SentOtpButtonModel;
