import dynamic from 'next/dynamic';

export const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export const MotionSection = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.section),
  { ssr: false }
);

export const MotionH2 = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.h2),
  { ssr: false }
);
export const MotionH3 = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.h3),
  { ssr: false }
);

export const MotionButton = dynamic(() =>
import('framer-motion').then((mod) => mod.motion.button),
  { ssr: false } 
)