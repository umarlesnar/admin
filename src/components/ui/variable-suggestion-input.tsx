"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Text from "./text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { variableOptions } from "@/lib/utils/common";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassname?: string;
  isRequired?: boolean;
  errorKey?: any;
  limit?: number;
  options?: any[];
}

const VariableSuggestionInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      isRequired = false,
      labelClassname,
      type,
      errorKey,
      limit,
      options = [],
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(""); // text after @
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [variables, setVariables] = React.useState(variableOptions);

    React.useEffect(() => {
      if (options?.length > 0) {
        setVariables(options);
      }
    }, [options]);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "@") {
        setOpen(true);
        setFilter("");
      } else if (open) {
        const selectionStart = e.currentTarget.selectionStart;
        if (selectionStart !== null) {
          const value = e.currentTarget.value;
          const lastAt = value.lastIndexOf("@", selectionStart - 1);

          if (lastAt !== -1) {
            const afterAt = value.slice(lastAt + 1, selectionStart);
            setFilter(afterAt.toLowerCase());
          } else {
            setOpen(false);
            setFilter("");
          }
        }
      }
    };

    const insertVariable = (variable: string) => {
      if (!inputRef.current) return;
      const el = inputRef.current;
      const start = el.selectionStart || 0;
      const value = el.value;
      const lastAt = value.lastIndexOf("@", start - 1);

      if (lastAt === -1) return;

      const before = value.substring(0, lastAt);
      const after = value.substring(start);
      el.value = before + variable + after;

      const newPos = before.length + variable.length;
      el.setSelectionRange(newPos, newPos);
      el.focus();
      setOpen(false);

      props.onChange?.({
        target: { value: el.value },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const filteredOptions = variables.map((group) => ({
      ...group,
      variables: group.variables.filter(
        (v) =>
          v.name.toLowerCase().includes(filter) ||
          v.value.toLowerCase().includes(filter)
      ),
    }));

    // Helper to safely get value length
    const getValueLength = () => {
      const val = props?.value;
      if (typeof val === "string" || Array.isArray(val)) {
        return val.length;
      }
      if (typeof val === "number") {
        return val.toString().length;
      }
      return 0;
    };

    return (
      <div className="space-y-[3px] relative">
        {isRequired || label ? (
          <div>
            {label && (
              <label
                className={`text-sm font-semibold text-text-primary ${labelClassname}`}
              >
                {label}
              </label>
            )}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
        ) : null}

        <Popover open={open}>
          <PopoverTrigger asChild>
            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              ref={inputRef}
              onKeyUp={handleKeyUp}
              {...props}
            />
          </PopoverTrigger>

          <PopoverContent className="w-64 p-1" side="bottom" align="start">
            <Command>
              <CommandList>
                {filteredOptions.map(
                  (group, index) =>
                    group.variables.length > 0 && (
                      <CommandGroup
                        heading={group.label}
                        key={index}
                        className="p-1"
                      >
                        {group.variables.map((variable, idx) => (
                          <CommandItem
                            key={idx}
                            onSelect={() => insertVariable(variable.value)}
                            className="flex flex-col items-start gap-0.5 cursor-pointer"
                          >
                            <Text className="font-medium">{variable.name}</Text>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {(errorKey || limit) && (
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
                {`${getValueLength()}/${limit}`}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  }
);

VariableSuggestionInput.displayName = "VariableInput";
export { VariableSuggestionInput };
