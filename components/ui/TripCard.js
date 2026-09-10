import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';

/**
 * TripCard — Premium carousel card matching the reference design exactly
 */
export const TripCard = ({
    image,
    title,
    country,
    duration,
    durationNights,
    transport,
    rating,
    reviewCount,
    price,
    currency = 'TND',
    href,
    badge,
}) => {
    return (
        <Link href={href || '#'} className="group block h-full">
            <article className="bg-white rounded-2xl border border-border-line overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-border-line">
                    <Image
                        src={image || '/voyage.jpg'}
                        alt={title || 'Voyage'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 380px"
                    />
                    
                    {/* Badge */}
                    {badge && (
                        <span className={`
                            absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-sm
                            ${badge === 'Best seller' ? 'bg-brand-orange text-white' : ''}
                            ${badge === 'Nouveau' ? 'bg-green-500 text-white' : ''}
                            ${badge === 'Promo' ? 'bg-red-500 text-white' : ''}
                            ${!['Best seller', 'Nouveau', 'Promo'].includes(badge) ? 'bg-white/95 text-text-main' : ''}
                        `}>
                            {badge}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-extrabold text-text-main leading-tight mb-1 group-hover:text-brand-orange transition-colors">
                        {title}
                    </h3>

                    {country && (
                        <div className="flex items-center gap-1 text-xs text-text-muted mb-2.5">
                            <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                            <span>{country}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-text-muted mb-3">
                        {duration && (
                            <span className="flex items-center gap-1">
                                <Icon icon="mdi:calendar-outline" className="w-3.5 h-3.5 shrink-0" />
                                {duration}{durationNights ? ` / ${durationNights}` : ''}
                            </span>
                        )}
                        {transport && (
                            <span className="flex items-center gap-1">
                                <Icon icon="mdi:airplane" className="w-3.5 h-3.5 shrink-0" />
                                {transport}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2 pt-3 border-t border-border-line">
                        {rating && (
                            <div className="flex items-center gap-1">
                                <Icon icon="mdi:star" className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                                <span className="text-xs font-bold text-text-main">{rating}/5</span>
                                {reviewCount && (
                                    <span className="text-[11px] text-text-muted">({reviewCount} avis)</span>
                                )}
                            </div>
                        )}
                        {price && (
                            <div className="text-right">
                                <p className="text-[9px] text-text-muted uppercase tracking-wide leading-none mb-0.5">À partir de</p>
                                <p className="text-base font-extrabold text-brand-orange leading-none">{price} <span className="text-[11px] font-bold text-text-muted">{currency}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};
