/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#025049", deep: "#013A35", soft: "#DCEDEA", line: "#B9D6D1" },
        sun: { DEFAULT: "#FEB803", soft: "#FFF1C2", text: "#8A5F00" },
        ink: { DEFAULT: "#12221F", muted: "#4C5F5B" },
        paper: "#F4F8F7",
        danger: "#B42318",
      },
      fontFamily: {
        display: ['"Sora"', '"Noto Sans Tamil"', "system-ui", "sans-serif"],
        sans: ['"Manrope"', '"Noto Sans Tamil"', "system-ui", "sans-serif"],
        tamil: ['"Noto Sans Tamil"', "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
      keyframes: {
        rise: { from: { transform: "translateY(55%)" }, to: { transform: "translateY(0)" } },
        fadein: { from: { opacity: "0" }, to: { opacity: "1" } },
        toast: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        rise: "rise 1.4s cubic-bezier(.2,.7,.2,1) both",
        fadein: "fadein .8s ease .9s both",
        toast: "toast .25s ease both",
      },
    },
  },
  plugins: [],
};
