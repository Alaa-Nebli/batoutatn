import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

/**
 * StickyMobileCTA — Persistent bottom bar on mobile for quick call/WhatsApp
 */
export const StickyMobileCTA = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 0.6;
            setVisible(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border-t border-border-line px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <a href="tel:+21671802881"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white active:bg-brand-navy-800 transition-colors">
                    <Icon icon="mdi:phone" className="h-5 w-5" aria-hidden="true" />
                    Appeler
                </a>
                <a href="https://wa.me/21694849694" target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white active:bg-green-700 transition-colors">
                    <Icon icon="mdi:whatsapp" className="h-5 w-5" aria-hidden="true" />
                    WhatsApp
                </a>
            </div>
        </div>
    );
};
