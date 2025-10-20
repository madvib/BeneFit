"use client";

import { ReactNode } from "react";

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function Card({
  title,
  actions,
  children,
  className = "",
  titleClassName = "",
}: CardProps) {
  return (
    <div
      data-testid="card"
      className={`bg-secondary p-4 sm:p-6 rounded-lg shadow-md ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          {title && (
            <h3 className={`text-xl sm:text-2xl font-bold ${titleClassName}`}>
              {title}
            </h3>
          )}
          {actions && <div className="self-start sm:self-auto">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
