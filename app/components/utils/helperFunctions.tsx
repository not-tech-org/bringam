import { toast, ToastPosition } from "react-toastify";
import Cookies from "js-cookie";

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
  return regex.test(password);
};

export const showToast = (
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
