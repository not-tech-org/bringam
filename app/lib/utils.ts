import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe localStorage handling for Next.js
export const safeLocalStorage = {
  getItem: (key: string, defaultValue?: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || defaultValue || "";
    }
    return defaultValue || "";
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Helper function to update localStorage and notify UserContext
export const updateUserData = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    safeLocalStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event to notify UserContext of changes
    window.dispatchEvent(new Event("userDataUpdated"));
  }
};

// Helper function to get user type information
export const getUserTypeInfo = () => {
  const userType = JSON.parse(
    safeLocalStorage.getItem("userDetails", '{"scope": []}')
  );
  const profileData = JSON.parse(
    safeLocalStorage.getItem("profileDetails", "{}")
  );

  const vendorCapable = Boolean(profileData?.vendorResp?.uuid);
  const vendorView =
    vendorCapable && Boolean(userType?.scope?.includes("VENDOR"));

  return {
    vendorCapable,
    vendorView,
    userType,
    profileData,
  };
};

// Cross-platform detection utilities
export const detectOS = () => {
  if (typeof window === "undefined") return "unknown";

  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  if (/Mac|iPhone|iPad|iPod/.test(platform)) return "mac";
  if (/Win/.test(platform)) return "windows";
  if (/Linux/.test(platform)) return "linux";
  if (/Android/.test(userAgent)) return "android";

  return "unknown";
};

export const detectBrowser = () => {
  if (typeof window === "undefined") return "unknown";

  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    return "chrome";
  if (userAgent.includes("Firefox")) return "firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "safari";
  if (userAgent.includes("Edg")) return "edge";

  return "unknown";
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check if user is on a touch device
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Get appropriate scrollbar class based on user preference and OS
export const getScrollbarClass = (minimal = false) => {
  const os = detectOS();

  // On Windows, users might prefer minimal scrollbars to be visible
  if (os === "windows" && minimal) {
    return "minimal-scrollbar";
  }

  // Default to hidden scrollbars for cleaner UI
  return "custom-scrollbar";
};

// Apply OS-specific classes to body element
export const applyOSClasses = () => {
  if (typeof window === "undefined") return;

  const os = detectOS();
  const browser = detectBrowser();

  document.body.classList.add(`os-${os}`);
  document.body.classList.add(`browser-${browser}`);

  if (isTouchDevice()) {
    document.body.classList.add("touch-device");
  }

  if (prefersReducedMotion()) {
    document.body.classList.add("reduced-motion");
  }
};

/**
 * Generates a user-friendly page title from a URL path
 * Handles dynamic routes and provides fallbacks
 */
export const generatePageTitle = (
  pathname: string,
  fallback?: string
): string => {
  if (!pathname) return fallback || "Page";

  // Remove leading slash and split by '/'
  const segments = pathname.replace(/^\//, "").split("/");

  // Get the last meaningful segment (not an ID)
  let titleSegment = segments[segments.length - 1];

  // If the last segment looks like an ID (UUID, long string, etc.), use the previous segment
  if (
    titleSegment &&
    (titleSegment.length > 20 || // Likely a UUID or long ID
      /^[a-f0-9-]{36}$/i.test(titleSegment) || // UUID pattern
      /^\d+$/.test(titleSegment)) // Numeric ID
  ) {
    titleSegment = segments[segments.length - 2] || titleSegment;
  }

  if (!titleSegment) return fallback || "Page";

  // Convert kebab-case to Title Case
  return titleSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Generates breadcrumb-style titles for nested routes
 */
export const generateBreadcrumbTitle = (pathname: string): string => {
  if (!pathname) return "Page";

  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

  // Filter out ID-like segments and convert to title case
  const meaningfulSegments = segments.filter(
    (segment) =>
      segment.length <= 20 &&
      !/^[a-f0-9-]{36}$/i.test(segment) &&
      !/^\d+$/.test(segment)
  );

  return meaningfulSegments
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" › ");
};

/**
 * Creates a loading state title with animation dots
 */
export const createLoadingTitle = (baseTitle: string = "Loading"): string => {
  return `${baseTitle}...`;
};

/**
 * Truncates long titles for better display
 */
export const truncateTitle = (
  title: string,
  maxLength: number = 50
): string => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + "...";
};
