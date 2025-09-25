import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

// Optimized SVG Icons with better performance
const MenuIcon = ({ className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = ({ className = "" }) => (
  <svg 
    width="24" 
    height="24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronIcon = ({ isOpen, className = "" }) => (
  <svg 
    width="16" 
    height="16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className}`}
    aria-hidden="true"
  >
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

export const Nav = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const servicesRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const { t } = useTranslation('common');

    // Navigation configuration - moved outside component for better performance
    const navigation = [
        { name: "Accueil", href: "/" },
        { name: "À Propos", href: "/about" },
        {
            name: "Services",
            href: "/our_services",
            hasDropdown: true,
            services: [
                { name: "Billetterie", href: "/services/ticketing" },
                { name: "Voyages Organisés", href: "/programs" },
                { name: "Excursions", href: "/services/excursions" },
                { name: "Transport", href: "/services/transport" }
            ]
        },
        { name: "Voyages", href: "/programs" },
        { name: "Contact", href: "#contact" },
    ];

    // Optimized event handlers with useCallback
    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
        setIsServicesOpen(false); // Close services when toggling main menu
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
    }, []);

    const toggleServices = useCallback(() => {
        setIsServicesOpen(prev => !prev);
    }, []);

    const openServices = useCallback(() => {
        setIsServicesOpen(true);
    }, []);

    const closeServices = useCallback(() => {
        setIsServicesOpen(false);
    }, []);

    // Handle hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close dropdowns when clicking outside - optimized
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setIsServicesOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
                setIsMenuOpen(false);
            }
        };

        if (isServicesOpen || isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside, { passive: true });
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isServicesOpen, isMenuOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        const handleRouteChange = () => {
            closeMenu();
        };

        router.events.on('routeChangeStart', handleRouteChange);
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router.events, closeMenu]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };

        if (isMenuOpen || isServicesOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isMenuOpen, isServicesOpen, closeMenu]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Check if current path is active
    const isActivePath = useCallback((href) => {
        if (href === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(href);
    }, [router.pathname]);

    // Render loading state during hydration
    if (!isMounted) {
        return (
            <nav className="relative" aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="hidden md:flex items-center space-x-8">
                            {/* Skeleton loading */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                        <div className="md:hidden">
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="relative" aria-label="Main navigation" role="navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                        {navigation.map((item) => (
                            <div key={item.name} className="relative">
                                {item.hasDropdown ? (
                                    <div ref={servicesRef} className="relative">
                                        <button
                                            onClick={toggleServices}
                                            onMouseEnter={openServices}
                                            onFocus={openServices}
                                            className={`flex items-center space-x-1 px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 rounded-lg hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                                                router.pathname.startsWith('/services') || router.pathname === item.href
                                                    ? 'text-orange-600 bg-orange-50' 
                                                    : 'text-gray-700'
                                            }`}
                                            aria-expanded={isServicesOpen}
                                            aria-haspopup="true"
                                        >
                                            <span>{item.name}</span>
                                            <ChevronIcon isOpen={isServicesOpen} />
                                        </button>
                                        
                                        {/* Services Dropdown */}
                                        <div 
                                            className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transition-all duration-200 transform ${
                                                isServicesOpen 
                                                    ? 'opacity-100 translate-y-0 scale-100 visible' 
                                                    : 'opacity-0 -translate-y-2 scale-95 invisible'
                                            }`}
                                            onMouseLeave={closeServices}
                                            role="menu"
                                            aria-orientation="vertical"
                                        >
                                            {item.services.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className={`block px-4 py-3 text-sm transition-colors duration-150 focus:outline-none focus:bg-orange-50 focus:text-orange-600 ${
                                                        isActivePath(service.href)
                                                            ? 'text-orange-600 bg-orange-50'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                                                    }`}
                                                    role="menuitem"
                                                >
                                                    {service.name}
                                                </Link>
                                            ))}
                                            <div className="border-t border-gray-100 my-2"></div>
                                            <Link
                                                href={item.href}
                                                className="block px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors duration-150 focus:outline-none focus:bg-orange-50"
                                                role="menuitem"
                                            >
                                                Voir tous les services
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                                            isActivePath(item.href)
                                                ? 'text-orange-600 bg-orange-50' 
                                                : 'text-gray-700 hover:text-orange-600'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        data-mobile-menu-button
                        onClick={toggleMenu}
                        className="md:hidden relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <div className="relative w-6 h-6">
                            <div className={`absolute inset-0 transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                                <MenuIcon />
                            </div>
                            <div className={`absolute inset-0 transition-opacity duration-200 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                                <CloseIcon />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isMenuOpen ? 'opacity-25 visible' : 'opacity-0 invisible'
                }`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Mobile Navigation */}
            <div 
                ref={mobileMenuRef}
                id="mobile-menu"
                className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out z-50 ${
                    isMenuOpen 
                        ? 'max-h-screen opacity-100 translate-y-0' 
                        : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'
                }`}
                role="menu"
                aria-orientation="vertical"
            >
                <div className="px-4 py-4 space-y-1 max-h-96 overflow-y-auto">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            {item.hasDropdown ? (
                                <div>
                                    <button
                                        onClick={toggleServices}
                                        className={`flex items-center justify-between w-full px-4 py-3 text-left text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                                            router.pathname.startsWith('/services')
                                                ? 'text-orange-600 bg-orange-50'
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                        }`}
                                        aria-expanded={isServicesOpen}
                                        aria-controls="mobile-services-menu"
                                    >
                                        <span>{item.name}</span>
                                        <ChevronIcon isOpen={isServicesOpen} />
                                    </button>
                                    
                                    {/* Mobile Services Submenu */}
                                    <div 
                                        id="mobile-services-menu"
                                        className={`transition-all duration-200 ease-in-out overflow-hidden ${
                                            isServicesOpen ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="ml-4 space-y-1 pb-2">
                                            {item.services.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    onClick={closeMenu}
                                                    className={`block px-4 py-3 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                                                        isActivePath(service.href)
                                                            ? 'text-orange-600 bg-orange-50'
                                                            : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {service.name}
                                                </Link>
                                            ))}
                                            <Link
                                                href={item.href}
                                                onClick={closeMenu}
                                                className="block px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                                            >
                                                Voir tous les services
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                                        isActivePath(item.href)
                                            ? 'text-orange-600 bg-orange-50'
                                            : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};