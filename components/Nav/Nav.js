import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

export const Nav = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const navigation = [
        { name: "Accueil", href: "/" },
        { name: "Voyages Organisés", href: "/programs" },
        { name: "Programmes en Tunisie", href: "/programmes-en-tunisie" },
        { name: "Vols", href: "/reservation-vols" },
        // {
        //     name: "Plus de Services",
        //     href: "/our_services",
        //     hasDropdown: true,
        //     services: [
        //         { name: "Excursions & Sur-mesure", href: "/services/excursions", icon: "mdi:compass-outline" },
        //         { name: "Transport Touristique", href: "/services/transport", icon: "mdi:bus-side" },
        //         { name: "Tous nos services", href: "/our_services", icon: "mdi:apps" }
        //     ]
        // },
        { name: "À Propos", href: "/about" },
    ];

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        if (isMenuOpen) { document.body.style.overflow = 'hidden'; }
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleRouteChange = () => setIsMenuOpen(false);
        router.events.on('routeChangeStart', handleRouteChange);
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router.events]);

    const isActivePath = useCallback((href) => {
        if (href === '/') return router.pathname === '/';
        return router.pathname.startsWith(href);
    }, [router.pathname]);

    if (!isMounted) {
        return (
            <nav className="flex items-center justify-end w-full h-14">
                <div className="hidden lg:flex space-x-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-16 bg-slate-100 rounded-full animate-pulse" />
                    ))}
                </div>
            </nav>
        );
    }

    return (
        <nav className="relative flex items-center justify-end w-full" aria-label="Main navigation">
            <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                    const isActive = isActivePath(item.href);
                    return (
                        <div key={item.name} className="relative group">
                            {item.hasDropdown ? (
                                <>
                                    <button
                                        className={`flex items-center gap-1 px-3 py-2 text-[13px] font-extrabold transition-all duration-200 ${
                                            isActive ? 'text-[#FF5E14]' : 'text-slate-500 hover:text-[#0B2D4D]'
                                        }`}
                                    >
                                        {item.name}
                                        <Icon icon="mdi:chevron-down" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                                        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 overflow-hidden">
                                            {item.services.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                                                        isActivePath(service.href) ? 'bg-[#FF5E14]/5 text-[#FF5E14]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B2D4D]'
                                                    }`}
                                                >
                                                    {service.icon && <Icon icon={service.icon} className="w-4 h-4 text-[#1D91CC]" />}
                                                    {service.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`relative inline-block px-3 py-2 text-[13px] font-extrabold transition-colors duration-200 ${
                                        isActive ? 'text-[#FF5E14]' : 'text-slate-500 hover:text-[#0B2D4D]'
                                    }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] bg-[#FF5E14] rounded-full" />
                                    )}
                                </Link>
                            )}
                        </div>
                    );
                })}

                {/* Slightly Rounded Orange Button */}
                <Link
                    href="/#contact"
                    className="ml-4 px-5 py-2.5 text-[13px] font-extrabold text-white bg-[#FF5E14] hover:bg-[#e04f0f] rounded-lg transition-colors duration-200 shadow-sm"
                >
                    Contactez-nous
                </Link>
            </div>

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative z-[60] p-2 text-[#0B2D4D] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Menu"
            >
                <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} className="w-5 h-5" />
            </button>

            {/* Mobile Drawer Backing Overlay */}
            <div 
                className={`lg:hidden fixed inset-0 bg-[#0B2D4D]/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div 
                className={`lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="px-6 pt-24 pb-8 space-y-1">
                    {navigation.map((item) => {
                        const isActive = isActivePath(item.href);
                        return (
                            <div key={item.name} className="border-b border-slate-100 pb-2 mb-2">
                                {item.hasDropdown ? (
                                    <>
                                        <div className="px-2 py-2 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            {item.name}
                                        </div>
                                        <div className="space-y-0.5">
                                            {item.services.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-extrabold transition-colors ${
                                                        isActivePath(service.href) ? 'bg-[#FF5E14]/5 text-[#FF5E14]' : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {service.icon && <Icon icon={service.icon} className="w-5 h-5 text-[#1D91CC]" />}
                                                    {service.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`block px-3 py-3 rounded-xl text-sm font-extrabold transition-colors ${
                                            isActive ? 'bg-[#FF5E14]/5 text-[#FF5E14]' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-6">
                        <Link
                            href="/#contact"
                            className="flex justify-center items-center w-full px-5 py-3.5 text-sm font-extrabold text-white bg-[#FF5E14] hover:bg-[#e04f0f] rounded-lg transition-all shadow-md shadow-[#FF5E14]/10"
                        >
                            Contactez-nous
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};