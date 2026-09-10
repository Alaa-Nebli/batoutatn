import React from 'react';
import clsx from 'clsx';

/**
 * SkeletonCard — Loading placeholder for travel cards
 */
export const SkeletonCard = ({ variant = 'vertical', count = 1 }) => {
    const isHorizontal = variant === 'horizontal';

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={clsx(
                        'flex bg-white rounded-2xl border border-border-line overflow-hidden',
                        isHorizontal ? 'flex-col md:flex-row' : 'flex-col'
                    )}
                >
                    {/* Image skeleton */}
                    <div
                        className={clsx(
                            'bg-border-line animate-pulse shrink-0',
                            isHorizontal
                                ? 'aspect-[16/10] md:aspect-auto md:w-[40%] md:min-h-[240px]'
                                : 'aspect-[4/3]'
                        )}
                    />

                    {/* Content skeleton */}
                    <div className="flex-1 p-5 space-y-3">
                        <div className="flex gap-2">
                            <div className="h-6 w-20 bg-border-line rounded-full animate-pulse" />
                            <div className="h-6 w-24 bg-border-line rounded-full animate-pulse" />
                        </div>
                        <div className="h-5 w-3/4 bg-border-line rounded animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-border-line rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-border-line rounded animate-pulse" />
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                            <div className="h-8 w-24 bg-border-line rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
