import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr" className="scroll-smooth">
      <Head>
        {/* Meta charset (improves indexing and encoding) */}
        <meta charSet="UTF-8" />

        {/* Preconnect to Google Fonts (if used) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon & Manifest (important for SEO and brand) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Canonical URL (optional, dynamic for multi-locale sites) */}
        {/* <link rel="canonical" href="https://www.batouta.tn" /> */}

        {/* Open Graph defaults (overridden in individual pages if needed) */}
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Batouta Voyages" />

        {/* Robots - ensure pages are indexable */}
        <meta name="robots" content="index, follow" />

        {/* Theme color for mobile address bar */}
        <meta name="theme-color" content="#ff6600" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
