"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProperties = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  type = "button",
  ...properties
}: ButtonProperties) {
  return (
    <button type={type} {...properties} className={`btn ${className || ""}`}>
      {children}
    </button>
  );
}
