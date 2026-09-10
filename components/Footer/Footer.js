import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    
    const footerLinks = [
        {
            title: "Découvrir",
            items: [
                { label: "Accueil", href: "/" },
                { label: "Voyages Organisés", href: "/programs" },
                { label: "Programmes en Tunisie", href: "/programmes-en-tunisie" },
                { label: "Réservation de Vols", href: "/vols" },
                { label: "Tous nos services", href: "/our_services" }
            ]
        },
        {
            title: "L'Agence",
            items: [
                { label: "À propos de nous", href: "/about" },
                { label: "Notre histoire", href: "/about#history" },
                { label: "Nos engagements", href: "/about#our-values" },
                { label: "Contactez-nous", href: "/#contact" },
            ]
        },
        {
            title: "Informations",
            items: [
                { label: "Conditions Générales", href: "/general_condition" },
                { label: "Politique de confidentialité", href: "/privacy" },
                { label: "Plan du site", href: "/sitemap" }
            ]
        }
    ];

    return (
        <footer className="bg-[#0B2D4D] text-white pt-16 pb-6 overflow-hidden border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 mb-12">
                    
                    {/* Brand */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <Link href="/" className="block mb-4" aria-label="Retour à l'accueil">
                            <Image
                                src="/Batouta_Logo.png"
                                alt="Batouta Voyages"
                                width={140}
                                height={56}
                                className="w-auto h-11 object-contain brightness-0 invert"
                                priority
                            />
                        </Link>
                        <p className="text-white/60 text-xs leading-relaxed mb-6 max-w-xs font-medium">
                            Batouta Voyages & Events, votre partenaire de confiance pour des voyages uniques en Tunisie et à travers le monde.
                        </p>
                        
                        <div className="flex gap-2.5">
                            {[
                                { icon: "mdi:facebook", href: "https://www.facebook.com/profile.php?id=100057621002945&locale=gl_ES&_rdr" },
                                { icon: "mdi:instagram", href: "https://www.instagram.com/batoutavoyages_events/?hl=fr" },
                                { icon: "mdi:whatsapp", href: "https://wa.me/21671802881" }
                            ].map((social, index) => (
                                <a 
                                    key={index}
                                    href={social.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-8.5 h-8.5 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#FF5E14] transition-all duration-200"
                                >
                                    <Icon icon={social.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-3 gap-6">
                            {footerLinks.map((section) => (
                                <div key={section.title}>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.items.map((item) => (
                                            <li key={item.label}>
                                                <Link 
                                                    href={item.href}
                                                    className="text-[11px] font-bold text-white/50 hover:text-[#FF5E14] transition-colors duration-150"
                                                >
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Staged Newsletter Stack to match exact designs */}
                    <div className="lg:col-span-3">
                        <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                            Restez inspiré
                        </h3>
                        <p className="text-xs text-white/50 leading-relaxed mb-4 font-medium">
                            Recevez nos meilleures offres et idées de voyages directement dans votre boîte mail.
                        </p>
                        <div className="space-y-2.5">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Votre adresse email"
                                    className="w-full bg-white rounded-xl px-4 py-3 pr-10 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#FF5E14] font-semibold"
                                />
                                <Icon icon="mdi:email-outline" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            </div>
                            <button className="w-full bg-[#FF5E14] hover:bg-[#e04f0f] text-white py-3 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#FF5E14]/10">
                                S&apos;abonner
                                <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom copyright details */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-white/30 text-center md:text-left">
                        © {currentYear} Batouta Voyages & Events. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-white/30">
                        <span className="w-px h-3 bg-white/10" />
                        <span>Développé Par</span>
                        <span className="w-px h-3 bg-white/10" />
                        <a href="https://www.neuratech.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#FF5E14] transition-colors">Neuratech Solutions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};