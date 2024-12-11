import axios from "axios";
import React, {
  createContext,
  useState,
  ChangeEvent,
  ReactNode,
  ChangeEventHandler,
} from "react";
import { signupUrl } from "@/plugins/url";
import { signupApi } from "../services/AuthService";

interface OnboardingContextType {
  onSignUp: (e: React.FormEvent) => Promise<void>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRouteChange: (value: string) => void;
  state: StateType;
}

interface StateType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  signupOTP: string;
  forgotPasswordOTP: string;
  route: string;
}

export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StateType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    route: "",
    signupOTP: "",
    forgotPasswordOTP: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = state;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRouteChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      route: value,
    }));
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const formApiData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      registrationChannel: "WEB",
    };

    try {
      const res = await signupApi(formApiData);
      console.log(res.data);
    } catch (err) {
      // dispatch(setError("Failed to load data"));
      console.log(err);
    } finally {
      // dispatch(setLoading(false));
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onSignUp,
        onChange,
        onRouteChange,
        state,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
};
