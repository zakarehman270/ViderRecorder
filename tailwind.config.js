// module.exports = {
// 	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
// 	theme: {
// 	  extend: {
// 		colors: {
// 			border: "#your-custom-color", // Ensure this is defined
// 			background: '#E6F2F3',
// 			foreground: '#yourColorHere',
// 		  },
// 	  },
// 	},
// 	plugins: [],
//   }

import motion from "tailwindcss-motion";
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#your-custom-color", // Ensure this is defined
        background: "#E6F2F3",
        foreground: "#yourColorHere",
        primary: "#6C63FF", // Replace this with the purple gradient's starting color.
        secondary: "#2B2C34", // Background color.
        purple: {
          100: "#3B83F5",
        },
        yellow: {
          400: "#3B83F5",
        },
        body: "var(--bs-body-color)",
        bodyBg: "var(--bs-body-bg)",
        borderColor: "var(--bs-border-color)",
      },
      borderRadius: {
        DEFAULT: "var(--bs-border-radius)",
      },
      keyframes: {
        typewriter: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        typewriter: "typewriter 2s steps(24, end) forwards",
      },
    },
  },
  plugins: [motion],
};
