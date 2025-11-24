"use client";
import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "@/components/ui/UserAvatar";
import { BotIcon } from "@/components/ui/icons/BotIcon";
import Text from "@/components/ui/text";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";

export function ProfilePopup({ options, selectedOption, onSelectData, show}: any) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { user } = useApplication();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <div className="flex items-center justify-center cursor-pointer gap-2">
        <Avatar className="w-7 h-7 cursor-pointer">
          <AvatarFallback className="bg-primary-800 text-sm font-bold text-white ">
            {user?.profile?.first_name?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-text-primary text-sm">
            {show ? <span>{user?.profile?.first_name}</span> : null}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] rounded-md p-1">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={(currentValue) => {
                  router.push("/app/settings/profile");
                  setOpen(false);
                }}
                className="gap-2 cursor-pointer px-3"
              >
                <Text color="secondary" weight="semibold">
                  Profile
                </Text>
              </CommandItem>
              <CommandItem
                onSelect={(currentValue) => {
                  setOpen(false);
                  signOut();
                }}
                className="gap-2 cursor-pointer px-3"
              >
                <Text textColor="text-red-500" weight="semibold">
                  Logout
                </Text>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
