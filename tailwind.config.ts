import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      // ShadCN
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        hipnode: "#FF4401",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
        // Custom
        100: "#C5D0E6",
        200: "#858EAD",
        300: "#97989D",
        400: "#192351",
        500: "#3F4354",
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
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    extend: {
      colors: {
        primary: "#FF4401",
        yellow: "#EA942C",
        blue: "#347AE2",
        purple: "#6570F7",
        green: "#0ECC8D",
        dark1: "#151A1E",
        dark2: "#1E252B",
        dark3: "#262D34",
        dark4: "#2C353D",
        background: "#FFFFFF",
        background2: "#F7F7F7",
        secondary1: "#192351",
        secondary2: "#3F4354",
        secondary3: "#97989D",
        secondary4: "#858EAD",
        secondary5: "#C5D0E6",
        secondary6: "#F4F6F8",
        redblack40: "#661B00",
        red90: "#FF571A",
        red80: "#FF6934",
        red60: "#FF8F67",
        red10: "#FFECE6",
        red: "#FF4401",
        yellow90: "#EC9F41",
        yellow80: "#EEA956",
        yellow30: "#F9DFC0",
        yellow10: "#FDF4EA",
        blueblack10: "#0A182D",
        blueblack80: "#2A62B5",
        blue90: "#4887E5",
        blue80: "#5D95E8",
        blue20: "#D6E4F9",
        blue10: "#EBF2FC",
        purpleblack10: "#141631",
        purple80: "#848DF9",
        purple20: "#E0E2FD",
        purple10: "#F0F1FE",
        green80: "#3ED6A4",
        green10: "#E7FAF4",
      },
      boxShadow: {
        "meetup-card": "0px 6px 8px 2px #3582E01F",
      },
      screens: {
        lg: "1440px",
        md2: "1208px",
        md: "1100px",
        sm: "768px",
      },
    },
  },
  plugins: [],
};
export default config;
