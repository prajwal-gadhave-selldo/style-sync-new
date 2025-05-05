"use client";

import { useTheme } from "next-themes";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useEffect, useState } from "react";

const DarkModeSwitchCustom = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setIsDark(newTheme === "dark");
  };

  if (!mounted) {
    return <div className="w-6 h-6" />; // Prevents layout shift
  }

  return (
    <div className="flex items-center justify-center p-1.5 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
      <DarkModeSwitch
        onChange={toggleTheme}
        checked={isDark}
        size={22}
        moonColor="#CBD5E1"
        sunColor="#F59E0B"
      />
    </div>
  );
};

export default DarkModeSwitchCustom;
