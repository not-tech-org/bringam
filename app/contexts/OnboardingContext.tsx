import axios from "axios";
import React, {
  createContext,
  useState,
  ChangeEvent,
  ReactNode,
  ChangeEventHandler,
} from "react";
import { signupUrl } from "@/plugins/url";

interface OnboardingContextType {
  onSignUp: () => Promise<void>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRouteChange: (value: string) => void;
  state: StateType;
}

interface StateType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
    route: "",
    signupOTP: "",
    forgotPasswordOTP: "",
  });

  const { firstName, lastName, email, password } = state;

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

  const onSignUp = async () => {
    const reqbody = {
      firstName,
      lastName,
      email,
      password
    }
    const response = await axios.post(`${signupUrl}`, reqbody);

  };

  return (
    <OnboardingContext.Provider
      value={{
        onSignUp,
        onChange,
        onRouteChange,
        state,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
