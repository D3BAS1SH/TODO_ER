const {heroui} = require('@heroui/theme');
// tailwind.config.js
// const { heroui } = require("@heroui/react");
import { heroui } from "@heroui/react";
import { model } from "mongoose";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "// ...",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|drawer|ripple|spinner|modal).js"
  ],
  theme: {
    extend: {
      fontFamily:{
        Lora:["Lora", "serif"],
        Explora:["Explora", "serif"]
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(),heroui()],
}