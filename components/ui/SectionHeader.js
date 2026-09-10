import React from 'react';
import clsx from 'clsx';

/**
 * SectionHeader — Consistent section title block
 */
export const SectionHeader = ({
    eyebrow,
    title,
    description,
    align = 'left',
    className,
    eyebrowClassName,
    titleClassName,
    descriptionClassName,
}) => {
    const alignStyles = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    };

    return (
        <div className={clsx('max-w-3xl', alignStyles[align], className)}>
            {eyebrow && (
                <p className={clsx('text-sm font-bold uppercase tracking-[0.18em] text-brand-blue', eyebrowClassName)}>
                    {eyebrow}
                </p>
            )}
            {title && (
                <h2 className={clsx('mt-3 text-3xl font-bold leading-tight text-text-main md:text-4xl text-balance', titleClassName)}>
                    {title}
                </h2>
            )}
            {description && (
                <p className={clsx('mt-3 text-base leading-relaxed text-text-muted', align === 'center' && 'mx-auto', descriptionClassName)}>
                    {description}
                </p>
            )}
        </div>
    );
};
