import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Alert({
  children,
  title = "Are you sure?",
  description = "Do you want to remove this operator ?",
  leftButtonProps,
  rightButtonProps,
  onRightButton,
  onLeftButton,
  RightButton = "Yes, Delete",
  LeftButton = "Cancel",
  icon,
}: any) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex  flex-col justify-center items-center">
        {icon}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (typeof onLeftButton == "function") {
                onLeftButton();
              }
              setOpen(false);
            }}
            {...leftButtonProps}
          >
            {LeftButton}
          </Button>
          <Button
            onClick={() => {
              if (typeof onRightButton == "function") {
                onRightButton();
              }
              setOpen(false);
            }}
            {...rightButtonProps}
          >
            {RightButton}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
