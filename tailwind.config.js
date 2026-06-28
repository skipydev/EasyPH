/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eef2ff',
					100: '#e0e7ff',
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
				},
				accent: {
					400: '#a5f3fc',
					500: '#06b6d4',
					600: '#0891b2',
				},
				background: {
					DEFAULT: '#09090b',
					card: '#111113',
					muted: '#18181b',
				},
				border: '#27272a',
			},
			fontFamily: {
				sans: ['Manrope', 'system-ui', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.8s ease-out',
				'slide-up': 'slideUp 0.6s cubic-bezier(0.77, 0, 0.175, 1)',
				reveal: 'reveal 0.9s cubic-bezier(0.77, 0, 0.175, 1) forwards',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				glow: 'glow 2s ease-in-out infinite alternate',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideUp: {
					'0%': { transform: 'translateY(40px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				reveal: {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				glow: {
					from: { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
					to: { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
				},
			},
			boxShadow: {
				modern:
					'0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
				glow: '0 0 30px rgba(99, 102, 241, 0.4)',
			},
			backgroundImage: {
				'gradient-hero':
					'linear-gradient(to bottom, #09090b, rgba(79, 38, 235, 0.2))',
			},
		},
	},
	plugins: [],
}
