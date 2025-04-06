/** @type {import('next').NextConfig} */

const { createSecureHeaders } = require("next-secure-headers");
const path = require("path");
const fs = require("fs");
const { i18n } = require('./next-i18next.config')

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: false
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    },
    images: {
        // ,"image/jpeg", "image/png", "image/jpg"
        formats: ["image/avif", "image/webp"],
        domains: ["s.gravatar.com", "bnlpzibmwmoragheykpt.supabase.co"]
      },      
    env: {
        siteTitle: "Batouta Voyages",
        siteDescription: "Since its founding in 1995, Batouta Voyages has been committed to providing unique and enriching travel experiences. Originally created to meet the needs of Japanese travelers, our agency quickly diversified to welcome clients from around the world: Europe, America, the Middle East, and our local market in Tunisia.",
        siteKeywords: "Travel, Agency, Tunisia",
        siteUrl: "https://www.batouta.tn/",
        siteImagePreviewUrl: "/Batouta_Logo.png",
    },
    i18n,
    headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    ...createSecureHeaders(),
                    // HSTS Preload: https://hstspreload.org/
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload"
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig;
