import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Formik } from "formik";
import React, { ReactElement, useState, useCallback, useMemo } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import * as Yup from "yup";

interface Props {
  children: ReactElement;
  data?: any;
  id?: any;
}

// Validation schema for delay with 10-minute max limit
const delayValidationSchema = Yup.object().shape({
  minutes: Yup.number()
    .min(0, "Minutes cannot be negative")
    .max(10, "Maximum 10 minutes allowed")
    .required("Minutes is required"),
  seconds: Yup.number()
    .min(0, "Seconds cannot be negative")
    .max(59, "Seconds must be less than 60")
    .required("Seconds is required")
    .test(
      "max-total-time",
      "Total delay cannot exceed 10 minutes",
      function (value) {
        const { minutes } = this.parent;
        const totalSeconds = (minutes || 0) * 60 + (value || 0);
        return totalSeconds <= 600; // 10 minutes = 600 seconds
      }
    ),
});

const SetDelayTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();

  const initialValues = useMemo(() => {
    const existingDelay = data?.delay || 1;
    const minutes = Math.floor(existingDelay / 60);
    const seconds = existingDelay % 60;

    return {
      minutes: Math.min(minutes, 10), // Ensure max 10 minutes
      seconds: minutes >= 10 ? 0 : seconds,
      ...data,
    };
  }, [data]);

  const handleSubmit = useCallback(
    (values: any) => {
      const totalDelay = Number(values.minutes) * 60 + Number(values.seconds);
      if (totalDelay > 600) return; // Extra safety check

      if (typeof updateNodeData === "function") {
        updateNodeData(id, {
          ...values,
          delay: totalDelay,
        });
      }
      setOpen(false);
    },
    [updateNodeData, id]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={delayValidationSchema}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit: formikSubmit,
        resetForm,
        setFieldValue,
      }) => {
        const totalSeconds =
          (Number(values.minutes) || 0) * 60 + (Number(values.seconds) || 0);
        const isMaxReached = totalSeconds >= 600;

        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) resetForm();
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[450px] h-screen flex flex-col p-0">
              <SheetHeader className="flex flex-row items-center justify-between p-4 border-b bg-slate-50">
                <div className="flex items-center gap-3">
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <CloseIcon className="w-4 h-4" />
                    </Button>
                  </SheetClose>
                  <SheetTitle className="text-lg font-semibold">
                    Set Delay (Max 10 min)
                  </SheetTitle>
                </div>
              </SheetHeader>

              <div className="flex-1 p-6 space-y-4">
                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Minutes"
                    name="minutes"
                    type="number"
                    min="0"
                    max="10"
                    value={values?.minutes || 0}
                    errorKey={errors?.minutes}
                    placeholder="0"
                    onChange={(e) => {
                      const newMinutes = Math.min(
                        Number(e.target.value) || 0,
                        10
                      );
                      setFieldValue("minutes", newMinutes);
                      if (newMinutes === 10) setFieldValue("seconds", 0);
                    }}
                    className="text-center"
                    isRequired
                  />
                  <Input
                    label="Seconds"
                    name="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={values?.seconds || 0}
                    errorKey={errors?.seconds}
                    placeholder="0"
                    onChange={(e) => {
                      const newSeconds = Math.min(
                        Number(e.target.value) || 0,
                        59
                      );
                      const currentMinutes = Number(values.minutes) || 0;
                      if (currentMinutes === 10) {
                        setFieldValue("seconds", 0);
                      } else {
                        setFieldValue("seconds", newSeconds);
                      }
                    }}
                    className="text-center"
                    disabled={Number(values.minutes) >= 10}
                    isRequired
                  />
                </div>

                {/* Quick Select Buttons */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Quick Select:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "30s", minutes: 0, seconds: 30 },
                      { label: "1m", minutes: 1, seconds: 0 },
                      { label: "2m", minutes: 2, seconds: 0 },
                      { label: "5m", minutes: 5, seconds: 0 },
                      { label: "10m", minutes: 10, seconds: 0 },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFieldValue("minutes", preset.minutes);
                          setFieldValue("seconds", preset.seconds);
                        }}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Warning for max limit */}
                {isMaxReached && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-sm text-amber-700">
                      ⚠️ Maximum delay limit of 10 minutes reached
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-4 border-t bg-slate-50">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  className="flex-1"
                  onClick={() => formikSubmit()}
                  disabled={totalSeconds === 0 || totalSeconds > 600}
                >
                  Save Delay
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default SetDelayTypeSheet;
