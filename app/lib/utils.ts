import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe localStorage handling for Next.js
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: string = ""): string => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    return localStorage.getItem(key) || defaultValue;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
