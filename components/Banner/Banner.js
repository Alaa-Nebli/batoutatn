import React from 'react';
import { motion, useScroll, useTransform} from 'framer-motion';
import { Icon } from '@iconify/react';
import Typewriter from 'typewriter-effect';
import { useTranslation } from 'next-i18next';

const Banner = () => {
    const { t } = useTranslation('common');
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
   
    const getWindowDimensions = () => {
      if (typeof window !== 'undefined') {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
      return { width: 0, height: 0 };
    };
  
    const dimensions = getWindowDimensions();
  
    return (
      <section className="relative h-screen overflow-hidden">
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-orange-900"
          style={{
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          }}
        >
          {/* Animated particles */}
          <motion.div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#fb923c' : '#fff',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                }}
                initial={{ x: Math.random() * dimensions.width, y: -20 }}
                animate={{
                  y: dimensions.height + 20,
                  x: Math.random() * dimensions.width,
                  rotate: 360,
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
  
        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y }}
          >
            <motion.div
              className="mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Icon 
                icon="game-icons:torii-gate" 
                className="w-16 h-16 md:w-24 md:h-24 text-orange-500 mx-auto"
              />
            </motion.div>
  
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <Typewriter
                options={{
                  strings: [
                    t('Services.Banner.title_1'),
                    t('Services.Banner.title_2'),
                    t('Services.Banner.title_3'),
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  html: true,
                  deleteSpeed: 30,
                }}
              />
            </h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t('Services.Banner.subtitle')}
            </motion.p>
  
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50"
              >
              {t('Services.Banner.button_text')}
              </motion.button>
            
            </motion.div>
          </motion.div>
        </div>
  
        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-white flex flex-col items-center gap-2">
            <p className="text-sm font-light tracking-widest uppercase">Scroll</p>
            <Icon 
              icon="mdi:arrow-down-circle" 
              className="w-8 h-8 md:w-12 md:h-12"
            />
          </div>
        </motion.div>
      </section>
    );
  };

  export default Banner;
