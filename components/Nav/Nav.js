import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

export const Nav = () => {
    const router = useRouter();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { t } = useTranslation('common');

    const navigation = [
        { name: t('nav.home'), href: "/" },
        { name: t('nav.about'), href: "/about" },
        { name: t('nav.our_services'), href: "/our_services" },
        { name: "Nos Voyages", href: "/programs" },
        {
            name: t('nav.contact'),
            href: "https://www.facebook.com/profile.php?id=100057621002945&locale=gl_ES&_rdr",
            isArrow: true,
            target: "_blank"
        },
    ];

    const closeNav = () => {
        setIsNavOpen(false);
    };

    return (
        <nav className="header-nav">
            <div className="header-nav--container">
                <button
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="mobile-menu"
                    aria-controls="navbar-dropdown"
                    aria-expanded="false"
                >
                    <span className="sr-only">{t('nav.openMenu')}</span>
                    <Icon
                        icon="material-symbols:menu-rounded"
                        className="h-6 w-auto text-black"
                    />
                </button>
                <div
                    className={`header-nav--menu-container z-20 ${isNavOpen ? "show" : "hide"}`}
                    id="navbar-default"
                >
                    <ul className="header-nav--menu">
                        {navigation.map((item) => (
                            <li key={item.href} className="header-nav--menu-item">
                                <Link href={item.href} passHref>
                                <div
                    className={`menu-item--link flex items-center ${
                        router.pathname === item.href ? "active" : ""
                    }`}
                    onClick={closeNav}
                    target={item.target ? item.target : "_self"}
                    style={{
                        position: 'relative',
                        fontWeight: 500,
                        transition: 'color 0.3s ease',
                        background: 'none',
                        color: router.pathname === item.href ? 'orange' : 'black'
                    }}
                >
                    {item.name}
                    <span
                        style={{
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: '-2px',
                            width: router.pathname === item.href ? '100%' : '0',
                            height: '2px',
                            backgroundColor: 'orange',
                            transition: 'width 0.3s ease'
                            
                        }}
                        className="underline-animation"
                    ></span>
                    {item.isArrow && (
                        <span className="ml-2 inline-block text-sm font-medium text-inherit">
                            <Icon
                                icon="material-symbols:arrow-outward"
                                className="h-6 w-auto"
                            />
                        </span>
                    )}
                </div>
            </Link>
        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
