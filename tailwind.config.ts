import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1E3A5F', light: '#2563EB', dark: '#0F2440' },
      },
    },
  },
  plugins: [],
}
export default config
