"use client";

import { ReactNode } from "react";

import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props} className={`btn ${className || ""}`}>
      {children}
    </button>
  );
}
