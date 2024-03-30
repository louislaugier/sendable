import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}', // Adjusted path relative to the location of tailwind.config.ts
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            500: "#BEF264",
            DEFAULT: "black",
            foreground: "white",
          },
          // focus: "black",
        },
      },
    },
  })],
} satisfies Config