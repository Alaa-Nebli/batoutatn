import "@styles/globals.scss";
import { appWithTranslation } from 'next-i18next'
import { LoadingScreen } from "@components/loading";
import React from "react";
import {useEffect,useState} from 'react';
function App({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay (e.g., for fetching data or assets)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // Adjust the delay as needed

        return () => clearTimeout(timer);
    }, []);

    // Show the Loading component during the first load
    if (isLoading) {
        return <LoadingScreen />;
    }
    return <Component {...pageProps} />;
}

export default appWithTranslation(App);