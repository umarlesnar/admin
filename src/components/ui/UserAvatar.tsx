import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import classNames from "classnames";
import React from "react";

type Props = {
  size?: string;
  className?: string;
  children: any;
};

const UserAvatar = ({ size = "md", children, className }: Props) => {
  return (
    <Avatar
      className={classNames(` cursor-pointer`, {
        "w-7 h-7": size == "sm",
        "w-10 h-10": size == "md",
        "w-16 h-16": size == "lg",
      })}
    >
      <AvatarFallback
        className={classNames(
          `bg-primary-800 text-sm font-bold text-white `,
          className
        )}
      >
        {children}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
