import Head from "next/head";

const SEO = ({ title, description, keywords }) => {
    const metaDescription = description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION;
    const metaKeywords = keywords || process.env.NEXT_PUBLIC_SITE_KEYWORDS;
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
    const imagePreview = `${siteURL}/${process.env.NEXT_PUBLIC_SITE_IMAGE_PREVIEW_URL}`;

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
        </Head>
    );
};

export default SEO;
