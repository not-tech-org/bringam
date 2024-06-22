import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        sidebarBg: "#FBFBFB",
        textGray: "#5F5F5F",
        black1: "#252C32",
        searchBg: "#FCFCFC",
        borderColor: "#EEEEEE",
        iconBg: "#EFEFFF",
        lightFadedBlue: "#9193EB",
        lightModeSubText: "#747474",
        grayPrimary: "#F7F7F7",
        black2: "#1F1F1F",
        bluePrimary: "#23A6F0",
        bluePrimary2: "#E6F6FF",
        bgSuccessPrimary: "#EFFFEE",
        successPrimary: "#2AAC27",
        bgErrorPrimary: "#FFEEEE",
        errorPrimary: "#AC2727",
        bgBluePrimary: "#F0F4FF",
      },
      fontFamily: {
        Poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
