import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { SectionContainer } from "components//Section";
import { Nav } from "components//Nav";
import { useTranslation } from 'next-i18next';

export const Header = () => {
    const router = useRouter();
   

    return (
        <header
            id="header"
            className="header fixed left-0 w-full z-30 top-0 bg-white backdrop-filter backdrop-blur-md bg-opacity-50"
        >
            <SectionContainer className="header--container wrap wrap-px flex justify-between items-center">
                <div className="header-logo--container">
                    <h1 className="logo mb-0">
                        <Link href="/">
                            <Image
                                src="/Batouta_Logo.png"
                                alt="logo"
                                className="h-20 w-auto"
                                height="700"
                                width="700"
                                priority
                            />
                        </Link>
                    </h1>
                </div>
                <SectionContainer className="flex items-center">
                    <Nav />
                </SectionContainer>
            </SectionContainer>
        </header>
    );
};

export default Header;