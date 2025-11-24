import * as React from "react";
import { cn } from "@/lib/utils";
import Text from "./text";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorKey?: any;
  limit?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, errorKey, limit, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            "flex max-h-[350px] min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorKey || limit ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {errorKey && (
                <Text size="xs" textColor="text-red-500" className="pt-1">
                  {errorKey}
                </Text>
              )}
            </div>
            {limit && (
              <Text size="xs" color="secondary" className="pt-1">
                {/* @ts-ignore */}
                {`${props?.value?.length}/${limit}`}
              </Text>
            )}
          </div>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
