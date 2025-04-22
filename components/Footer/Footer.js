import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from "next/legacy/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const SectionContainer = ({ id, children, className = "" }) => {
    return (
        <section id={id} className={`${className && className}`}>
            {children}
        </section>
    );
};
export const Footer = () => {
    const { t } = useTranslation('common');
    const currentYear = new Date().getFullYear();
    
    const FOOTER_LINKS = [
        {
            title: "Explorer",
            items: [
                { label: "À propos de nous", href: "/about#who-we-are" },
                { label: "Nos services", href: "/our_services" },
                { label: "Notre histoire", href: "/about#history" },
                { label: "Nos valeurs", href: "/about#our-values" },
            ]
        },
        {
            title: "Connectez-vous avec nous",
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
            title: "Plan du site",
            items: [
                { label: "Acceuil", href: "/" },
                { label: "Nos Services", href: "/our_services" },
                { label: "Contact", href: "#contact" },
                { label: "Conditions Générales", href: "/general_condition" }
            ]
        }
    ];

    const FooterLink = ({ item }) => {
        if (item.isExternal) {
            return (
                <a
                    href={item.href}
                    className="mb-2 inline-flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-orange-500"
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
                className="mb-2 inline-flex items-center gap-2 font-medium text-gray-600 transition-colors duration-300 hover:text-orange-500"
            >
                {item.label}
            </Link>
        );
    };

    return (
        <footer id="footer" className="bg-gradient-to-b from-gray-50 via-white to-orange-50">
            <SectionContainer className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <div className="space-y-8">
                                <Link href="/" className="block">
                                    <Image
                                        src="/Batouta_Logo.png"
                                        alt="Batouta Travel Logo"
                                        width={300}
                                        height={150}
                                        className="h-auto w-auto"
                                        priority
                                    />
                                </Link>
                                
                                <div className="flex gap-4">
                                    <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-orange-200 transition">
                                        <Icon icon="mdi:facebook" className="text-orange-600" />
                                    </a>
                                    <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-orange-200 transition">
                                        <Icon icon="mdi:instagram" className="text-orange-600" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                {FOOTER_LINKS.map((section) => (
                                    <div key={section.title} className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
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

            <div className="border-t border-gray-300 bg-gradient-to-r from-orange-100 to-white">
                <SectionContainer className="relative z-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                            <p className="text-sm text-gray-700">
                                © {currentYear} Batouta voyages. All rights reserved.
                            </p>
                            <p className="text-sm text-gray-700">
                                Designed and developed by{" "}
                                <a
                                    className="ml-1 text-orange-600 transition-colors duration-300 hover:underline"
                                    href="https://neuratech-solutions.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Neuratech Solutions
                                </a>
                            </p>
                        </div>
                    </div>
                </SectionContainer>
            </div>
        </footer>
    );
};
