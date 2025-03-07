// pages/_app.js
import "styles//globals.scss";
import { appWithTranslation } from 'next-i18next';
import { LoadingScreen } from "@components/loading";
import { Layout } from "@components/Layout";
import { SessionProvider } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";

function App({ Component, pageProps: { session, ...pageProps } }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAdminRoute = router.pathname.startsWith('/admin');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <SessionProvider session={session}>
           {
            isAdminRoute ? (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                    <Component {...pageProps} />
            )
           } 

        </SessionProvider>
    );
}

export default appWithTranslation(App);