// tailwind.config.js
// const { nextui } = require("@nextui-org/react");
import { nextui } from "@nextui-org/react";
import { model } from "mongoose";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...,
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
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
  plugins: [nextui()],
}