import { toast, ToastPosition } from "react-toastify";
import Cookies from "js-cookie";
import Toastify from "toastify-js";

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
  return regex.test(password);
};

// Toast configuration with subtle colors matching auth implementation
const TOAST_STYLES = {
  success: {
    backgroundColor: "#ECFDF3", // Subtle green
    textColor: "#027A48", // Dark green
    icon: "✓",
  },
  error: {
    backgroundColor: "#FEF3F2", // Subtle red
    textColor: "#B42318", // Dark red
    icon: "✕",
  },
  warning: {
    backgroundColor: "#FFFAEB", // Subtle yellow
    textColor: "#B54708", // Dark yellow/orange
    icon: "⚠",
  },
  info: {
    backgroundColor: "#F0F9FF", // Subtle blue
    textColor: "#1E40AF", // Dark blue
    icon: "ℹ",
  },
};

// Generic showToast function with subtle colors
export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "success",
  options?: {
    duration?: number;
    position?: "left" | "center" | "right";
    gravity?: "top" | "bottom";
  }
) => {
  const style = TOAST_STYLES[type];
  const {
    duration = 3000,
    position = "right",
    gravity = "top",
  } = options || {};

  Toastify({
    text: `${style.icon} ${message}`,
    duration,
    close: true,
    gravity,
    position,
    backgroundColor: style.backgroundColor,
    className: "rounded-lg border",
    style: {
      color: style.textColor,
      border: `1px solid ${style.textColor}20`,
      fontWeight: "500",
      minWidth: "300px",
      fontFamily: "var(--font-poppins), sans-serif",
    },
    stopOnFocus: true,
  }).showToast();
};

// Legacy support for react-toastify (keeping for backward compatibility)
export const showReactToast = (
  message: string,
  type: "success" | "error",
  dirPosition?: ToastPosition
) => {
  toast[type](message, {
    position: dirPosition || "top-right",
    theme: "colored",
  });
};

type CookieOptions = Cookies.CookieAttributes;

export const useCookies = () => {
  const setCookie = (name: string, value: string, options?: CookieOptions) => {
    Cookies.set(name, value, options);
  };

  const getCookie = (name: string) => {
    return Cookies.get(name);
  };

  const removeCookie = (name: string) => {
    Cookies.remove(name);
  };

  return { setCookie, getCookie, removeCookie };
};

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
