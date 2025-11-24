import * as React from "react";
import { cn } from "@/lib/utils";
import { EyeOffIcon } from "./icons/EyeOffIcon";
import { EyeIcon } from "./icons/EyeIcon";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassname?: string;
  isRequired?: boolean;
  errorKey?: any;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      isRequired = false,
      labelClassname,
      errorKey,
      type,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);

    const handleShow = () => {
      setShow((prev) => {
        return !prev;
      });
    };

    return (
      <div className="space-y-1">
        {label && (
          <label
            className={`text-sm font-semibold text-text-primary px-1 ${labelClassname}`}
          >
            {label}
          </label>
        )}
        {isRequired && <span className="text-red-500 ">*</span>}
        <div className="flex items-center justify-start h-9 group w-auto rounded-md border border-border-input bg-background px-3 py-2 gap-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
          <input
            type={show ? "text" : "password"}
            className={cn(
              "appearance-none block w-full text-sm font-normal text-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 outline-none",
              className
            )}
            ref={ref}
            {...props}
          />
          <span className="text-base font-medium text-gray-800">
            {show ? (
              <EyeOffIcon
                onClick={handleShow}
                className="h-4 cursor-pointer text-icon"
              />
            ) : (
              <EyeIcon
                onClick={handleShow}
                className="h-4 cursor-pointer text-icon"
              />
            )}
          </span>
        </div>{" "}
        {errorKey && (
          <p className="text-xs font-normal text-red-500">{errorKey}</p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
