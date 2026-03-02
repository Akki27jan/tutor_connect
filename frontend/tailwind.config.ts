import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0f4ff",
                    100: "#dbe4ff",
                    200: "#bac8ff",
                    300: "#91a7ff",
                    400: "#748ffc",
                    500: "#5c7cfa",
                    600: "#4c6ef5",
                    700: "#4263eb",
                    800: "#3b5bdb",
                    900: "#364fc7",
                },
                accent: {
                    50: "#e6fcf5",
                    100: "#c3fae8",
                    200: "#96f2d7",
                    300: "#63e6be",
                    400: "#38d9a9",
                    500: "#20c997",
                    600: "#12b886",
                    700: "#0ca678",
                    800: "#099268",
                    900: "#087f5b",
                },
                dark: {
                    50: "#c1c2c5",
                    100: "#a6a7ab",
                    200: "#909296",
                    300: "#5c5f66",
                    400: "#373a40",
                    500: "#2c2e33",
                    600: "#25262b",
                    700: "#1a1b1e",
                    800: "#141517",
                    900: "#101113",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-in-right": "slideInRight 0.3s ease-out",
                "pulse-soft": "pulseSoft 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                pulseSoft: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.8" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
