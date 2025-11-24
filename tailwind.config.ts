import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        icon: {
          DEFAULT: "#768683",
          brand: "#43B751",
          primary: "#2F2B3DE5",
          onLight: "#FFFFFF",
          secondary: "#768683",
          teritary: "#C0C7C6",
        },
        surface: {
          dark: "#143518",
          light: "#FFFFFF",
        },
        input: "#D1D5DB",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          "100": "#E3E1FC",
          "200": "#C7C2F9",
          "300": "#ABA4F6",
          "400": "#8F85F3",
          "500": "#7367F0",
          "600": "#675DD8",
          "700": "#6258CC",
          "800": "#5C52C0",
          "900": "#564DB4",
          DEFAULT: "#675DD8",
          foreground: "hsl(var(--primary-foreground))",
        },
        neutral: {
          "10": "#FAFBFA",
          "20": "#F5F6F6",
          "30": "#EBEDED",
          "40": "#DEE2E1",
          "50": "#C0C7C6",
          "60": "#B1B9B8",
          "70": "#A4AEAC",
          "80": "#95A19E",
          "90": "#869391",
          "100": "#768683",
          "200": "#677875",
          "300": "#586B67",
          "400": "#4B5F5C",
          "500": "#3C524E",
          "600": "#304742",
          "700": "#1E3732",
          "800": "#0F2925",
          "900": "#021E19",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          blue_100: "#DEEDFF",
          orange: "#FFE3D3",
          yellow: "#FFFACA",
          green: "#EAFFF7",
          blue: "#E7F6FF",
          purple: "#EEE5FF",
          pink: "#FFE8EC",
          green_2: "#DEF5DE",
          green_active: "#D1FAE5",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        text: {
          primary: "#304742",
          secondary: "#586B67",
          teritary: "#768683",
          brand: "#43B751",
          onDark: "#021E19",
          onLight: "#FFFFFF",
        },
        border: {
          primary: "#43B751",
          secondary: "#95A19E",
          teritary: "#DEE2E1",
          input: "#D1D5DB",
          onDark: "#1B4A21",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
