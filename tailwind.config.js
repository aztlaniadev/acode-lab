/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Copper Design System Colors
      colors: {
        copper: {
          50: '#fef7f0',
          100: '#feeee0',
          200: '#fcd4b6',
          300: '#f9b885',
          400: '#f59e4c',
          500: '#dc7633',
          600: '#c0622d',
          700: '#a14d24',
          800: '#83401e',
          900: '#6d341a',
          950: '#3b1a0c'
        },
        neutral: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        }
      },
      colors: {
        // 🎨 Cores Base do Acode Lab - Profissionais e Minimalistas
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Cores Primárias - Neutros Profissionais
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        
        // Cores Secundárias - Cinzas Elegantes
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          dark: "hsl(var(--secondary-dark))",
        },
        
        // Cores de Acento - Azul Sutil
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))",
          dark: "hsl(var(--accent-dark))",
        },
        
        // Cores de Status
        destructive: "hsl(var(--destructive))",
        destructiveForeground: "hsl(var(--destructive-foreground))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-foreground))",
        popover: "hsl(var(--popover))",
        popoverForeground: "hsl(var(--popover-foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        
        // Cores da Marca - Sutil
        brand: "hsl(var(--brand))",
        brandForeground: "hsl(var(--brand-foreground))",
        
        // Cores de Status - Neutros
        status: {
          online: "hsl(var(--status-online))",
          busy: "hsl(var(--status-busy))",
          offline: "hsl(var(--status-offline))",
        },
        
        // Cores de Nível - Gradiente Sutil
        level: {
          beginner: "hsl(var(--level-beginner))",
          intermediate: "hsl(var(--level-intermediate))",
          advanced: "hsl(var(--level-advanced))",
          expert: "hsl(var(--level-expert))",
          master: "hsl(var(--level-master))",
        },
        
        // Cores de Sucesso/Erro - Sutis
        success: "hsl(var(--success))",
        successForeground: "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        warningForeground: "hsl(var(--warning-foreground))",
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "var(--radius-card)",
        ele: "var(--radius-ele)",
      },
      
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "slide-in-left": {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.95, transform: "scale(1.02)" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
      
      // Gradientes personalizados - Sutis
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "var(--brand-gradient)",
        "gradient-subtle": "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--secondary)))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}




