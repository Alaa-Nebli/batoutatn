import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const ContactMethod = ({ icon, iconBg, label, value, href, actionText, badge, delay = 0 }) => (
  <motion.a 
    href={href || '#'}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4, delay }}
    className="group block bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
  >
    <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${iconBg} shadow-sm shadow-black/5`}>
      <Icon icon={icon} className="w-5 h-5 text-white" />
    </div>
    
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <h3 className="text-[15px] font-black text-[#0B2D4D] leading-tight mb-3 break-words">{value}</h3>
    
    {badge && (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-[#07B574] text-[10px] font-extrabold uppercase tracking-wide mb-3">
        <Icon icon="mdi:check-circle" className="w-3.5 h-3.5 text-[#07B574]" />
        {badge}
      </span>
    )}
    
    {actionText && (
      <div className="flex items-center gap-1 text-xs font-extrabold text-[#FF5E14] group-hover:text-[#e04f0f] transition-colors mt-2">
        {actionText}
        <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    )}
  </motion.a>
);

const ContactSection = () => {
  const contactMethods = [
    {
      icon: 'mdi:phone',
      iconBg: 'bg-[#FF5E14]',
      label: "Appelez-nous",
      value: "+216 71 802 881",
      href: 'tel:+21671802881',
      actionText: "Nous appeler",
      delay: 0.05
    },
    {
      icon: 'mdi:whatsapp',
      iconBg: 'bg-[#07B574]',
      label: "WhatsApp",
      value: "+216 94 849 694",
      href: 'https://wa.me/21694849694',
      actionText: "Écrire sur WhatsApp",
      badge: "Réponse rapide",
      delay: 0.1
    },
    {
      icon: 'mdi:email',
      iconBg: 'bg-[#1D91CC]',
      label: "Email",
      value: 'travel@batouta.com',
      href: 'mailto:travel@batouta.com',
      actionText: "Envoyer un email",
      delay: 0.15
    },
    {
      icon: 'mdi:map-marker',
      iconBg: 'bg-[#1D91CC]',
      label: "Notre Adresse",
      value: "97, Rue de Palestine, 2ème étage, 1002 Tunis",
      href: 'https://maps.google.com/?q=97+Rue+de+Palestine+Tunis',
      actionText: "Voir sur la carte",
      delay: 0.2
    },
    {
      icon: 'mdi:clock-outline',
      iconBg: 'bg-[#1D91CC]',
      label: "Heures d'ouverture",
      value: "Lundi - Vendredi : 8h30 – 17h00",
      actionText: "Voir les horaires",
      delay: 0.25
    },
    {
      icon: 'mdi:facebook-messenger',
      iconBg: 'bg-[#1D91CC]',
      label: "Messenger",
      value: '@batoutavoyages',
      href: 'https://m.me/147493781967985',
      actionText: "Envoyer un message",
      delay: 0.3
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-slate-50" id="contact">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-left opacity-[0.15] mix-blend-overlay"
          style={{ backgroundImage: 'url(/tunisia/Discover_Tunisia_Banner.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-100/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5E14] mb-2">
            À votre écoute
          </p>
          <h2 className="text-3xl font-black text-[#0B2D4D] leading-tight">
            Parlons de votre prochaine <span className="text-[#1D91CC]">évasion.</span>
          </h2>
          <div className="mt-3.5 w-12 h-1 bg-[#FF5E14] rounded-full mb-5" />
          <p className="max-w-md text-sm text-slate-500 font-medium leading-relaxed">
            Notre équipe est à votre disposition pour concevoir avec vous le voyage qui vous ressemble. Contactez-nous par le canal qui vous convient le mieux.
          </p>
        </motion.div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {contactMethods.map((method, index) => (
            <ContactMethod key={index} {...method} />
          ))}
        </div>

        <motion.div 
          className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-[380px] w-full">
            <iframe
              title="Localisation Batouta Voyages"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5726527330544!2d10.181673!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0x7c56c6c3cd5d6403!2s97%20Rue%20de%20Palestine%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1699372841010!5m2!1sen!2s"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            <div className="absolute top-6 left-6 z-10 w-80 bg-white rounded-2xl p-6 shadow-xl border border-slate-100/80 hidden md:block animate-fade-in">
              <h3 className="text-base font-extrabold text-[#0B2D4D] mb-1.5">Batouta Voyages & Events</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                97, Rue de Palestine, 2ème étage<br/>1002 Tunis, Tunisie
              </p>
              <a 
                href="https://maps.google.com/?q=97+Rue+de+Palestine+Tunis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1D91CC] hover:text-[#1678aa] transition-colors"
              >
                Voir sur Google Maps
                <Icon icon="mdi:arrow-right" className="w-4 h-4 text-[#FF5E14]" />
              </a>
            </div>
          </div>
          
          <div className="p-6 bg-white border-t border-slate-100 md:hidden">
            <h3 className="text-base font-extrabold text-[#0B2D4D] mb-1">Batouta Voyages & Events</h3>
            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
              97, Rue de Palestine, 2ème étage, 1002 Tunis, Tunisie
            </p>
            <a 
              href="https://maps.google.com/?q=97+Rue+de+Palestine+Tunis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1D91CC]"
            >
              Voir sur Google Maps
              <Icon icon="mdi:arrow-right" className="w-4 h-4 text-[#FF5E14]" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-[14px] font-extrabold text-[#0B2D4D]">Suivez-nous et rejoignez notre communauté</h3>
            </div>
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {[
                { icon: 'mdi:facebook', color: 'bg-[#1877F2]', label: 'Facebook', handle: '@batoutavoyages', href: 'https://www.facebook.com/profile.php?id=100057621002945&locale=gl_ES&_rdr' },
                { icon: 'mdi:instagram', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600', label: 'Instagram', handle: '@batoutavoyages', href: 'https://www.instagram.com/batoutavoyages_events/?hl=fr' },
                { icon: 'mdi:whatsapp', color: 'bg-[#07B574]', label: 'WhatsApp', handle: '+216 94 849 694', href: 'https://wa.me/21694849694' },
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-9 h-9 rounded-full ${social.color} flex items-center justify-center text-white transition-transform group-hover:scale-105`}>
                    <Icon icon={social.icon} className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-[#0B2D4D] leading-tight">{social.label}</p>
                    <p className="text-[10px] font-semibold text-slate-400 leading-tight mt-0.5">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;