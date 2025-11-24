import cn from "classnames";
import React, { forwardRef, ButtonHTMLAttributes, useState } from "react";
import { RefreshIcon } from "./icons/RefreshIcon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick?: any;
  size?: string;
}

const RefreshButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, onClick, size = "normal", ...rest } = props;
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
      setIsSpinning(true);
      // Execute the onClick function if it's provided
      if (typeof onClick == "function") {
        onClick();
      }
      // After 2 seconds, stop spinning
      setTimeout(() => {
        setIsSpinning(false);
      }, 500);
    };

    const rootClassName = cn(
      `border border-input rounded-md p-2.5 cursor-pointer flex items-center justify-center group`,
      className
    );

    return (
      <button
        ref={ref}
        className={rootClassName}
        onClick={handleClick}
        {...rest}
      >
        <RefreshIcon
          className={cn(
            ` text-gray-400 group-hover:text-primary ${
              isSpinning ? "animate-spin" : ""
            } `,
            {
              "w-4 h-4": size === "normal",
              "w-2 h-2 ": size === "sm",
              "w-3 h-3 ": size === "md",
            },
            className
          )}
        />
      </button>
    );
  }
);

RefreshButton.displayName = "RefreshButton";

export default RefreshButton;
