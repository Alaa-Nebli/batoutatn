/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./utils/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                body: ["Roboto", "Sans Serif"],
                title: ["Roboto", "Sans Serif"]
            },
            fontSize: {
                body: ["1rem", { lineHeight: "1.5rem" }],
                h1: ["3.5rem", { lineHeight: "3.75rem" }],
                h2: ["2.25rem", { lineHeight: "2.625rem" }],
                h3: ["1.875rem", { lineHeight: "2.25rem" }],
                h4: ["1.5rem", { lineHeight: "2rem" }],
                h5: ["1.25rem", { lineHeight: "1.75rem" }],
                h6: ["1.125rem", { lineHeight: "1.5rem" }],
                mini: ["0.75rem", { lineHeight: "1.5rem" }]
            },
            boxShadow: {
                'card': '0 4px 20px rgba(0,0,0,0.06)',
                'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
                'orange': '0 10px 30px rgba(243,112,33,0.25)',
            },
            colors: {
                // ─── Batouta Brand Colors (NEW) ───
                // Primary conversion: Batouta Orange (the sun from the logo)
                'brand-orange': {
                    DEFAULT: '#F37021',
                    50: '#FFF8F5',
                    100: '#FFE0CC',
                    200: '#FFC7A3',
                    300: '#FFA97A',
                    400: '#F98C52',
                    500: '#F37021',
                    600: '#D85A12',
                    700: '#B5460E',
                    800: '#92350B',
                    900: '#702808',
                },
                // Trust & travel: Batouta Blue (the swoosh from the logo)
                'brand-blue': {
                    DEFAULT: '#28A9E0',
                    50: '#F0F9FF',
                    100: '#EAF7FD',
                    200: '#B8E3F5',
                    300: '#7FCAED',
                    400: '#4FB5E5',
                    500: '#28A9E0',
                    600: '#168FC4',
                    700: '#0F72A0',
                    800: '#0A587C',
                    900: '#06405A',
                },
                // Premium depth: Deep Travel Navy
                'brand-navy': {
                    DEFAULT: '#0B2D4D',
                    50: '#E8EDF2',
                    100: '#C5D0E0',
                    200: '#9DB0CA',
                    300: '#7490B4',
                    400: '#5579A4',
                    500: '#366294',
                    600: '#2C5686',
                    700: '#1D416C',
                    800: '#132D52',
                    900: '#0B2D4D',
                },
                // Warm backgrounds
                'bg-warm': '#FFFDF8',
                'bg-sky': '#EAF7FD',
                'bg-sand': '#FFF3E8',
                // Text
                'text-main': '#172033',
                'text-muted': '#64748B',
                'text-light': '#94A3B8',
                // Border
                'border-line': '#E6EAF0',
                // Teal (supporting only)
                'teal': {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    500: '#14B8A6',
                    600: '#12A594',
                    700: '#0F8579',
                },

                // ─── Legacy Compatibility (REQUIRED for SCSS files) ───
                black: {
                    DEFAULT: "#000000",
                    50: "#E6E6E6", 100: "#CCCCCC", 200: "#999999", 300: "#666666",
                    400: "#333333", 500: "#000000", 600: "#000000", 700: "#000000",
                    800: "#000000", 900: "#000000"
                },
                white: {
                    DEFAULT: "#FFFFFF",
                    50: "#FFFFFF", 100: "#FCFCFC", 200: "#FCFCFC", 300: "#FAFAFA",
                    400: "#FAFAFA", 500: "#F7F7F7", 600: "#C7C7C7", 700: "#949494",
                    800: "#636363", 900: "#303030"
                },
                primary: {
                    50: "#FCFCFC", 100: "#FCFCFC", 200: "#FCFCFC", 300: "#FCFCFC",
                    400: "#FAFAFA", 500: "#FAFAFA", 600: "#E3E3E3", 700: "#C7C7C7",
                    800: "#A6A6A6", 900: "#787878", 950: "#595959"
                },
                secondary: {
                    50: "#FFF9F0", 100: "#FFF5E5", 200: "#FFEBCC", 300: "#FFDEAD",
                    400: "#FFD494", 500: "#FFC56E", 600: "#FFA929", 700: "#EB8D00",
                    800: "#C77700", 900: "#8A5300", 950: "#663D00"
                },
                badge: "#F1F5F9",
                badgeText: "#475569"
            }
        }
    },
    plugins: []
};
