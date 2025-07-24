import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
    const metaDescription = description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION;
    const metaKeywords = keywords || process.env.NEXT_PUBLIC_SITE_KEYWORDS;
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
    const imagePreview = `${siteURL}/${process.env.NEXT_PUBLIC_SITE_IMAGE_PREVIEW_URL}`;

    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Batouta Voyages",
        "url": siteURL,
        "logo": `${siteURL}/Batouta_Logo.png`,
        "description": metaDescription,
        "telephone": "+216 71 802 881",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "97 Rue de La Palestine",
            "addressLocality": "Tunis",
            "postalCode": "1002",
            "addressCountry": "TN"
        },
        "contactPoint": [{
            "@type": "ContactPoint",
            "contactType": "customer service",
            "telephone": "+216 71 802 881",
            "email": "contact@batouta.tn"
        }],
        "sameAs": [
            "https://www.facebook.com/batoutavoyages",
            "https://www.instagram.com/batoutavoyages",
        ],
        "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        }]
    };

    const jsonLdWebSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteURL,
        "name": "Batouta Voyages",
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteURL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="language" content="fr" />
            <meta name="author" content="Batouta.tn" />

            {/* Open Graph (pour Facebook & WhatsApp) */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteURL} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={imagePreview} />
            <meta property="og:locale" content="fr_FR" />

            <link rel="canonical" href={siteURL} />

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />

            <title>{title}</title>
            {/* JSON-LD Structured Data for Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
            />
            {/* JSON-LD Structured Data for WebSite (site-wide search) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
            />
        </Head>
    );
};

export default SEO;
