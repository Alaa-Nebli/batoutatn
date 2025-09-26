import Head from "next/head";
import { useRouter } from "next/router";

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image, 
    type = 'website',
    structuredData,
    noIndex = false,
    canonical,
    alternateLanguages
}) => {
    const router = useRouter();
    const metaDescription = description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Batouta Voyages - Votre agence de voyage premium en Tunisie. Voyages organisés, excursions, transport et billetterie.";
    const metaKeywords = keywords || process.env.NEXT_PUBLIC_SITE_KEYWORDS || "voyage tunisie, agence voyage, excursions tunisie, transport premium, billetterie avion";
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn";
    const currentURL = `${siteURL}${router.asPath}`;
    const canonicalURL = canonical || currentURL;
    const imagePreview = image || `${siteURL}/${process.env.NEXT_PUBLIC_SITE_IMAGE_PREVIEW_URL || 'Batouta_Logo.png'}`;

    // Enhanced Organization Schema for Travel Agency
    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Batouta Travel",
        "alternateName": "Batouta Voyages",
        "url": siteURL,
        "logo": {
            "@type": "ImageObject",
            "url": `${siteURL}/Batouta_Logo.png`,
            "width": 300,
            "height": 100
        },
        "description": metaDescription,
        "telephone": "+216 71 802 881",
        "email": "contact@batouta.tn",
        "foundingDate": "2008",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "97 Rue de La Palestine",
            "addressLocality": "Tunis",
            "postalCode": "1002",
            "addressCountry": "TN",
            "addressRegion": "Tunis"
        },
        "contactPoint": [{
            "@type": "ContactPoint",
            "contactType": "customer service",
            "telephone": "+216 71 802 881",
            "email": "contact@batouta.tn",
            "availableLanguage": ["French", "Arabic", "English"],
            "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
            }
        }],
        "sameAs": [
            "https://www.facebook.com/batoutavoyages",
            "https://www.instagram.com/batoutavoyages",
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Tunisia"
        },
        "serviceArea": {
            "@type": "Country", 
            "name": "Tunisia"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Travel Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Voyages à l'étranger",
                        "description": "Circuits organisés premium vers les meilleures destinations"
                    }
                },
                {
                    "@type": "Offer", 
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Excursions en Tunisie",
                        "description": "Découverte des trésors locaux et sites emblématiques"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service", 
                        "name": "Transport Premium",
                        "description": "Services de transport haut de gamme"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Billetterie",
                        "description": "Réservation de billets d'avion aux meilleurs prix"
                    }
                }
            ]
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "300",
            "bestRating": "5",
            "worstRating": "3"
        }
    };

    const jsonLdWebSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteURL,
        "name": "Batouta Travel",
        "alternateName": "Batouta Voyages",
        "description": metaDescription,
        "inLanguage": "fr-TN",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteURL}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    // Breadcrumb Schema
    const generateBreadcrumbs = () => {
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Accueil",
                    "item": siteURL
                }
            ]
        };

        let currentPath = siteURL;
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            let name = segment;
            
            // Translate common segments
            if (segment === 'services') name = 'Services';
            else if (segment === 'programs') name = 'Programmes';
            else if (segment === 'about') name = 'À Propos';
            else if (segment === 'contact') name = 'Contact';

            breadcrumbs.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": name.charAt(0).toUpperCase() + name.slice(1),
                "item": currentPath
            });
        });

        return breadcrumbs;
    };

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            {/* Title */}
            <title>{title}</title>
            
            {/* Meta Description & Keywords */}
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            
            {/* Language & Author */}
            <meta name="language" content="fr-TN" />
            <meta name="author" content="Batouta Travel" />
            <meta name="publisher" content="Batouta Travel" />
            
            {/* Robots & Indexing */}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            )}
            
            {/* Canonical URL */}
            <link rel="canonical" href={canonicalURL} />
            
            {/* Alternate Languages */}
            {alternateLanguages && alternateLanguages.map((alt, index) => (
                <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
            ))}
            
            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentURL} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={imagePreview} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="fr_TN" />
            <meta property="og:site_name" content="Batouta Voyages" />
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={imagePreview} />
            <meta name="twitter:creator" content="@Neuratech Solutions" />
            <meta name="twitter:site" content="@BatoutaVoyages" />

            {/* Additional Meta Tags for Travel Industry */}
            <meta name="geo.region" content="TN" />
            <meta name="geo.placename" content="Tunisia" />
            <meta name="geo.position" content="36.8065;10.1815" />
            <meta name="ICBM" content="36.8065, 10.1815" />
            
            {/* Business/Travel specific meta */}
            <meta name="classification" content="Travel Agency" />
            <meta name="category" content="Travel, Tourism, Vacation, Holiday" />
            <meta name="coverage" content="Tunisia" />
            <meta name="distribution" content="global" />
            <meta name="target" content="travelers, tourists, vacation planners" />
            
            {/* Favicon and Icons */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f97316" />
            
            <meta name="msapplication-TileColor" content="#f97316" />
            <meta name="theme-color" content="#ffffff" />
            
            {/* Preconnect for Performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            
            {/* DNS Prefetch for External Resources */}
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            
            {/* JSON-LD Structured Data for Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
            />
            
            {/* JSON-LD Structured Data for WebSite */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
            />
            
            {/* Breadcrumb Schema */}
            {router.asPath !== '/' && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbs()) }}
                />
            )}
            
            {/* Custom Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
        </Head>
    );
};

export default SEO;
