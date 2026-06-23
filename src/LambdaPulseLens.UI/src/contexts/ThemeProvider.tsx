import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProviderContext, type Theme } from "./themeContext";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "lambda-pulse-theme"
}: ThemeProviderProps) {
  //initialize the theme
  const [theme, setTheme] = useState<Theme>(() => {
    //user has set their theme into localStorage
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }

    //user has not chosen the theme, use OS/browser preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    //fallback to default theme
    return defaultTheme;
  });

  //update <html> tag on theme change
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  //bunde the theme and setter into a 'value' object
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    toggleTheme: () => {
      //inject <style> tag to disable all transitions
      const css = document.createElement("style");
      css.appendChild(document.createTextNode("* { transition: none !important; }"));
      document.head.appendChild(css);

      //apply the theme
      const newTheme = theme === "light" ? "dark" : "light";
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);

      //force the browser to repaint immediately
      window.getComputedStyle(document.body);

      //remove the transition blocker after 1 second
      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
