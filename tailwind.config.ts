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
    },
  },
};
