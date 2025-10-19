"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      data-testid="loading-spinner"
      className={`flex items-center justify-center ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-4 border-muted border-t-primary rounded-full animate-spin`}
      ></div>
    </div>
  );
}
