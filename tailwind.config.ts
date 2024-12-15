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
        textGray2: "#979797",
        textGray3: "#737373",
        textGray4: "#BDBDBD",
        black1: "#252C32",
        black2: "#1F1F1F",
        black3: "#1A1A1A",
        green: "#23856D",
        searchBg: "#FCFCFC",
        borderColor: "#EEEEEE",
        iconBg: "#EFEFFF",
        lightFadedBlue: "#9193EB",
        lightModeSubText: "#747474",
        grayPrimary: "#F7F7F7",
        bluePrimary: "#23A6F0",
        bluePrimary2: "#E6F6FF",
        bgSuccessPrimary: "#EFFFEE",
        successPrimary: "#2AAC27",
        bgErrorPrimary: "#FFEEEE",
        errorPrimary: "#AC2727",
        bgBluePrimary: "#F0F4FF",
        bgArmy: "#3C4948",
        lightArmy: "#8CACAA",
        lighterArmy: "#B3B3B3",
        offWhite: "#FCFCFC",
      },
      fontFamily: {
        Poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
