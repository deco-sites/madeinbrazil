import daisyui from "daisyui";
import tailwindforms from "@tailwindcss/forms";

export default {
  plugins: [daisyui, tailwindforms],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    fontFamily: {
      default: ["Lexend", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
    extend: {
      colors: {
        "primary-opaque": "rgba(36, 36, 36, 0.20)",
        "primary-opaque-dark": "rgba(36, 36, 36, 0.40)",
        "gray-opaque": "rgba(171, 171, 171, 0.20)",
        "gray-opaque-light": "rgba(171, 171, 171, 0.15)",
        "gray-opaque-dark": "rgba(171, 171, 171, 0.40)",
        "green-opaque": "rgba(22, 184, 62, 0.40)",
        "yellow-opaque": "rgba(255, 225, 31, 0.60)",
      },
      keyframes: {
        "bottom-to-top-140": {
          "0%": { transform: "translateY(140%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "bottom-to-top-275": {
          "0%": { transform: "translateY(275%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "width-left-to-right-80": {
          "0%": { width: "0%" },
          "100%": { width: "80%" },
        },
        "width-left-to-right-100": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "bottomtotop140": "bottom-to-top-140 300ms ease-in-out",
        "bottomtotop275": "bottom-to-top-275 300ms ease-in-out",
        "widthlefttoright80": "width-left-to-right-80 300ms ease-in-out",
        "widthlefttoright100": "width-left-to-right-100 600ms ease-in-out",
      },
    },
  },
};
