/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',      // Ocean Blue
                secondary: '#14B8A6',    // Tropical Teal
                accent: {
                    yellow: '#FACC15',   // Sunshine Yellow
                    coral: '#FB7185',    // Coral Pink
                },
                background: '#F8FAFC',   // Soft White
                text: '#1E293B',         // Slate Dark
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
