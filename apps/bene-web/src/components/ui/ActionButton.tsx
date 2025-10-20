"use client";

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export default function ActionButton({
  onClick,
  icon,
  label,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
}: ActionButtonProps) {
  // Define button styles based on variant
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-ghost text-red-600 hover:text-red-700 dark:hover:text-red-400",
  };

  // Define size classes
  const sizeClasses = {
    sm: "p-2 rounded-full",
    md: "p-2 rounded-full",
    lg: "p-3 rounded-full",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} ${label ? "flex items-center gap-2" : ""}`}
      aria-label={label}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
