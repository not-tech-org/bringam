import axios from "axios";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1`;

export const signupApi = async (data: object) => {
  const response = await axios.post(
    `http://new-jointly-chamois.ngrok-free.app/auth-service/api/v1/registration/customer-sign-up`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
