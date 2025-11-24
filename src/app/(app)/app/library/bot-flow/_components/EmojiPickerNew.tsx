import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmojiIcon } from "@/components/ui/icons/EmojiIcon";
import React from "react";
import Picker from "emoji-picker-react";

type Props = {
  onChange?: any;
  iconClassName?: any;
};

const EmojiPickerNew = ({ onChange, iconClassName }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EmojiIcon
          className={` ${
            iconClassName ? iconClassName : "w-3.5 h-3.5"
          } text-icon-primary cursor-pointer`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="p-0">
        <Picker
          onEmojiClick={(value) => {
            if (typeof onChange == "function") {
              onChange(value?.emoji);
            }
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmojiPickerNew;
