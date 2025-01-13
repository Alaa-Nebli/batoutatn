import React from 'react';
import { SectionContainer } from "components//Section";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const FOOTER_LINKS = [
    {
        title: "Explore",
        items: [
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Our Services", href: "/our_services" }
        ]
    },
    {
        title: "Connect with Us",
        items: [
            { 
                label: "Facebook", 
                href: "https://www.facebook.com/profile.php?id=100057621002945&locale=gl_ES&_rdr", 
                isExternal: true,
                icon: "mdi:facebook"
            },
            { 
                label: "Instagram", 
                href: "https://www.instagram.com/batoutavoyages_events/?hl=fr", 
                isExternal: true,
                icon: "mdi:instagram"
            },
          
        ]
    },
    {
        title: "Sitemap",
        items: [
            { label: "Home", href: "/" },
            { label: "Our Services", href: "/our_services" },
            { label: "Travel Packages", href: "/packages" },
            { label: "Contact Us", href: "/contact" },
            { label: "General Conditions", href: "/general_condition" }
        ]
    }
];

const FooterLink = ({ item }) => {
    if (item.isExternal) {
        return (
            <a
                href={item.href}
                className="mb-2 inline-flex items-center gap-2 font-medium text-gray-700 transition-colors duration-300 hover:text-orange-600"
                target="_blank"
                rel="noopener noreferrer"
            >
                {item.icon && (
                    <span className="text-lg">
                        <Icon icon={item.icon} />
                    </span>
                )}
                {item.label}
            </a>
        );
    }

    return (
        <Link 
            href={item.href}
            className="mb-2 inline-flex items-center gap-2 font-medium text-gray-700 transition-colors duration-300 hover:text-orange-600"
        >
            {item.label}
        </Link>
    );
};

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer" className="relative bg-orange-100">
            {/* Main Footer Content */}
            <SectionContainer className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Logo and Description */}
                        <div className="lg:col-span-4">
                            <div className="space-y-8">
                                <Link href="/" className="block">
                                    <Image
                                        src="/Batouta_Logo.png"
                                        alt="Batouta Travel Logo"
                                        width={150}
                                        height={150}
                                        className="h-auto w-auto"
                                        priority
                                    />
                                </Link>
                                <p className="text-base text-gray-600">
                                    Pursuing excellence in travel services since 1995.
                                    <br /> 
                                    Discover the world with Batouta Travel.
                                </p>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                {FOOTER_LINKS.map((section) => (
                                    <div key={section.title} className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {section.items.map((item) => (
                                                <li key={item.label}>
                                                    <FooterLink item={item} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>

            {/* Footer Credits */}
            <div className="border-t border-gray-200 bg-orange-50">
                <SectionContainer className="relative z-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center py-6">
                            <p className="text-base text-gray-700">
                                © {currentYear} Batouta Travel. All rights reserved{" - "}
                                <span className="font-normal">
                                    Designed by{" "}
                                    <a
                                        className="text-orange-600 transition-colors duration-300 hover:underline"
                                        href="https://www.cogneria.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Cogneria
                                    </a>
                                </span>
                            </p>
                        </div>
                    </div>
                </SectionContainer>
            </div>
        </footer>
    );
};