import React, { ChangeEvent, createContext, ReactNode, useState } from "react";

interface VendorContextType {
  onSignUpVendor: (e: React.FormEvent) => any;
  state: StateType;
}

interface StateType {
  email: string;
  businessName: string;
  category: string;
}

export const VendorContext = createContext<VendorContextType | undefined>(
  undefined
);

export const OnVendorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StateType>({
    email: "",
    businessName: "",
    category: "",
  });

  const { email, businessName, category } = state;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
};
