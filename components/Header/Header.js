import Link from "next/link";
import Image from "next/image";
import { SectionContainer } from "components/Section";
import { Nav } from "components/Nav";
import { Icon } from "@iconify/react";

export const Header = () => {
    return (
        <header
            id="header"
            className="header fixed left-0 w-full z-40 top-0 bg-white/95 backdrop-blur-md border-b border-slate-100"
        >
            {/* Top contact bar — dark navy */}
            {/* TO USE bg-[rgb(5,9,221)] */}
            <div className="bg-[#0B2D4D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-9">
                        <div className="flex items-center gap-4 text-[11px] font-bold text-white/90">
                            <a href="tel:+21671802881" className="inline-flex items-center gap-1.5 hover:text-[#FF5E14] transition-colors">
                                <Icon icon="mdi:phone" className="h-3.5 w-3.5 text-[#FF5E14]" />
                                <span className="hidden sm:inline">+216 71 802 881</span>
                            </a>
                            <a href="https://wa.me/21694849694" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                                <Icon icon="mdi:whatsapp" className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="hidden sm:inline">+216 94 849 694</span>
                            </a>
                            <a href="mailto:outgoing@batouta.com" className="hidden items-center gap-1.5 hover:text-[#FF5E14] transition-colors md:inline-flex">
                                <Icon icon="mdi:email-outline" className="h-3.5 w-3.5 text-[#FF5E14]" />
                                outgoing@batouta.com
                            </a>
                            <span className="hidden items-center gap-1.5 text-white/60 lg:inline-flex">
                                <Icon icon="mdi:map-marker" className="h-3.5 w-3.5 text-[#FF5E14]" />
                                97 Rue de Palestine, Tunis
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="https://www.facebook.com/Batouta.tn" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <Icon icon="mdi:facebook" className="h-4 w-4" />
                            </a>
                            <a href="https://www.instagram.com/batouta.tn/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                                <Icon icon="mdi:instagram" className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main navigation container */}
            <SectionContainer className="header--container wrap wrap-px flex justify-between items-center py-3">
                <div className="header-logo--container">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/Batouta_Logo.avif"
                            alt="Batouta Voyages"
                            className="h-11 md:h-12 w-auto object-contain"
                            height="120"
                            width="300"
                            priority
                        />
                    </Link>
                </div>
                <SectionContainer className="flex items-center">
                    <Nav />
                </SectionContainer>
            </SectionContainer>
        </header>
    );
};

export default Header;
