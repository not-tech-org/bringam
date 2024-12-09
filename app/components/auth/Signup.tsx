import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setData, setLoading, setError } from "../../store/slices/authSlice";
import { signupApi } from "@/app/services/AuthService";
interface IRootState {
  authSlice: {
    refetchAPIBusiness: boolean;
  };
}
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: any) => state.authSlice);
  console.log(loading);

  const handleInputChange = (property: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [property]: value,
    }));
  };

  console.log(data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setLoading(true));

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
      dispatch(setData(res.data));
    } catch (err) {
      dispatch(setError("Failed to load data"));
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}>
      <div className="text-center">
        <p className="font-bold text-2xl">Create account</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Get started by creating an account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full mt-6">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          placeholder="Enter first name"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          placeholder="Enter last name"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="abc@gmail.com"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Password"
          type="text"
          name="password"
          id="password"
          value={password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Confirm Password"
          type="text"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        {loading ? (
          <Button type="button" disabled primary>
            Create account
          </Button>
        ) : (
          <Button type="submit" primary>
            Create account
          </Button>
        )}

        <div className="text-center">
          <p className="text-textGray2">
            Already have an account?{" "}
            <span className="text-bgArmy">
              <Link href="#">Sign in</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
