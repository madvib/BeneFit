"use client";

import { useState } from "react";
import { signOut } from "@/app/(auth)/actions";
import Button from "@/components/ui/Button/Button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "ghost";
  className?: string;
  onItemClick?: () => void;
}

export function LogoutButton({
  variant = "default",
  className,
  onItemClick,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      if (onItemClick) {
        onItemClick();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSignOut}
      className={className}
      data-testid="logout-form"
    >
      <Button
        type="submit"
        disabled={isLoading}
        className={`${variant === "ghost" ? "btn-ghost" : ""} ${variant === "default" ? "w-full" : ""}`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Signing out...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogOut data-testid="logout-icon" className="h-4 w-4" />
            Logout
          </span>
        )}
      </Button>
    </form>
  );
}
