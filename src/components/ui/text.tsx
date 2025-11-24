import React, { CSSProperties, JSXElementConstructor } from "react";
import cn from "classnames";

type Size = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
type Tag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "label"
  | "span"
  | "div";
type Weight =
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

type Color =
  | "primary"
  | "secondary"
  | "teritary"
  | "white"
  | "success"
  | "error"
  | "warning"
  | "brand";

interface Props {
  size?: Size;
  tag?: Tag;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode | any;
  html?: any;
  direction?: string;
  weight?: Weight;
  textColor?: string;
  color?: Color;
  onClick?: any;
  htmlFor?: string;
}

const Text: React.FC<Props> = ({
  style,
  className,
  size = "sm",
  weight = "regular",
  tag = "p",
  color = "primary",
  textColor,
  children,
  html,
  onClick,
  htmlFor,
}) => {
  let _color: any = color;

  if (color) {
    if (color == "primary") {
      _color = `text-text-primary`;
    } else if (color == "secondary") {
      _color = `text-text-secondary`;
    } else if (color == "teritary") {
      _color = `text-text-teritary`;
    } else if (color == "white") {
      _color = `text-white`;
    } else if (color == "brand") {
      _color = `text-text-brand`;
    } else {
      _color = "text-text-primary";
    }
  }

  const componentsMap: {
    [P in Tag]: React.ComponentType<any> | string;
  } = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    p: "p",
    label: "label",
    span: "span",
    div: "div",
  };

  const Component:
    | JSXElementConstructor<any>
    | React.ReactElement<any>
    | React.ComponentType<any>
    | string = componentsMap![tag!];

  const htmlContentProps = html
    ? {
        dangerouslySetInnerHTML: { __html: html },
      }
    : {};

  return (
    <Component
      className={cn(
        `font-poppins ${textColor ? textColor : _color}`,
        `font-poppins ${textColor ? textColor : _color}`,
        {
          "text-xs leading-4": size == "xs",
          "text-sm leading-5": size == "sm",
          "text-base leading-6": size == "base",
          "text-lg leading-7": size == "lg",
          "text-xl leading-7": size == "xl",
          "text-2xl leading-8": size == "2xl",
          "font-light": weight == "light",
          "font-normal": weight == "regular",
          "font-medium": weight == "medium",
          "font-bold": weight == "bold",
          "font-semibold": weight == "semibold",
          "font-extrabold": weight == "extrabold",
        },
        className
      )}
      htmlFor={htmlFor}
      style={style}
      {...htmlContentProps}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Text;
