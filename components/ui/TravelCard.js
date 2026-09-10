import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

/**
 * TravelCard — Unified card for all travel offers
 * Variants: vertical (carousel/homepage), horizontal (listing page), compact (related trips)
 */
export const TravelCard = ({
    image,
    title,
    description,
    price,
    duration,
    route,
    date,
    badge,
    href,
    variant = 'vertical',
    featured = false,
    className,
}) => {
    const isHorizontal = variant === 'horizontal';

    return (
        <article
            className={clsx(
                'group flex bg-white rounded-2xl border border-border-line overflow-hidden transition-all duration-300 hover:shadow-card-hover',
                isHorizontal ? 'flex-col md:flex-row' : 'flex-col h-full',
                featured && 'ring-2 ring-brand-orange',
                className
            )}
        >
            {/* Image Section */}
            <div
                className={clsx(
                    'relative overflow-hidden bg-border-line shrink-0',
                    isHorizontal
                        ? 'aspect-[16/10] md:aspect-auto md:w-[38%] md:min-h-[220px]'
                        : 'aspect-[4/3]'
                )}
            >
                <Image
                    src={image || '/voyage.jpg'}
                    alt={title || 'Voyage'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={isHorizontal ? '(max-width: 768px) 100vw, 38vw' : '(max-width: 768px) 82vw, 31vw'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />

                {/* Badge */}
                {badge && (
                    <span className={clsx(
                        'absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-extrabold shadow-sm uppercase tracking-wide',
                        featured ? 'bg-brand-orange text-white' : 'bg-white/95 text-text-main'
                    )}>
                        {badge}
                    </span>
                )}

                {/* Price overlay on image (vertical only) */}
                {price && !isHorizontal && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/80">À partir de</p>
                            <p className="text-lg font-bold text-white drop-shadow-md">{price}</p>
                        </div>
                        {date && (
                            <span className="rounded-md bg-brand-navy/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                                {date}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className={clsx('flex flex-col', isHorizontal ? 'p-5 md:p-6 flex-1 justify-between' : 'flex-1 p-5')}>
                <div>
                    {/* Title */}
                    <h3 className={clsx('font-bold text-text-main leading-tight', isHorizontal ? 'text-lg md:text-xl line-clamp-2' : 'text-base line-clamp-1')}>
                        {title}
                    </h3>

                    {/* Location */}
                    {route && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-text-muted">
                            <Icon icon="mdi:map-marker-outline" className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                            <span className="line-clamp-1">{route}</span>
                        </div>
                    )}

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {duration && (
                            <div className="flex items-center gap-1 text-[11px] text-text-muted">
                                <Icon icon="mdi:clock-outline" className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                                <span>{duration}</span>
                            </div>
                        )}
                        {date && (
                            <div className="flex items-center gap-1 text-[11px] text-text-muted">
                                <Icon icon="mdi:calendar-outline" className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                                <span>{date}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-muted">{description}</p>
                    )}
                </div>

                {/* Footer: Price (horizontal) + CTA */}
                <div className={clsx('flex items-center gap-3', isHorizontal ? 'mt-4 pt-4 border-t border-border-line' : 'mt-4')}>
                    {isHorizontal && price && (
                        <div className="mr-auto">
                            <p className="text-[9px] text-text-muted font-medium uppercase tracking-wide">À partir de</p>
                            <p className="text-lg font-extrabold text-brand-orange leading-none">{price}</p>
                        </div>
                    )}
                    <Link
                        href={href || '#'}
                        className={clsx(
                            'inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-200',
                            'bg-brand-orange text-white hover:bg-brand-orange-dark'
                        )}
                    >
                        Découvrir
                        <Icon icon="mdi:chevron-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
};
