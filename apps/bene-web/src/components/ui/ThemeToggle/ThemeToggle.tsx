"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import Button from "@/components/ui/Button/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun data-testid="theme-icon" className="h-5 w-5" />
      ) : (
        <Moon data-testid="theme-icon" className="h-5 w-5" />
      )}
    </Button>
  );
}
