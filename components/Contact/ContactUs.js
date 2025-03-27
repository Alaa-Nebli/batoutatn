import React from 'react';
import { useTranslation } from 'next-i18next';
import { Icon } from '@iconify/react';

const ContactMethod = ({ icon, label, value, href, isWhatsApp = false }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] hover:shadow-lg transition-all duration-300">
    <div className={`absolute inset-0 bg-gradient-to-r ${isWhatsApp ? 'from-green-50 to-green-100/50' : 'from-orange-50 to-orange-100/50'} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
    <div className="relative flex items-start gap-4">
      <div className={`rounded-xl p-3 ${isWhatsApp ? 'bg-green-100/50' : 'bg-orange-100/50'}`}>
        <Icon icon={icon} className={`h-6 w-6 ${isWhatsApp ? 'text-green-600' : 'text-orange-600'}`} />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{label}</h3>
        {href ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`mt-1 text-sm ${isWhatsApp ? 'text-gray-600 hover:text-green-600' : 'text-gray-600 hover:text-orange-600'} transition-colors flex items-center gap-1`}
          >
            {value}
            {isWhatsApp && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                WhatsApp
              </span>
            )}
          </a>
        ) : (
          <p className="mt-1 text-sm text-gray-600">{value}</p>
        )}
      </div>
    </div>
  </div>
);

const ContactSection = () => {
  const { t } = useTranslation('common');

  const contactMethods = [
    {
      icon: 'mdi:phone',
      label: "Appelez-nous",
      value: "+216 71 802 881",
      href: 'tel:+21671802881'
    },
    {
      icon: 'ic:baseline-whatsapp',
      label: "WhatsApp",
      value: "+216 71 802 881",
      href: 'https://wa.me/21671802881',
      isWhatsApp: true
    },
    {
      icon: 'mdi:message',
      label: "Messenger",
      value: 'Batouta Voyages',
      href: 'https://m.me/147493781967985'
    },
    {
      icon: 'mdi:email-outline',
      label: "Email",
      value: 'contact@batouta.com',
      href: 'mailto:contact@batouta.com'
    },
    {
      icon: 'mdi:map-marker',
      label: "Notre Adresse",
      value: "97, Rue de Palestine 2ème étage 1002 TUNIS"
    },
    {
      icon: 'mdi:clock-outline',
      label: "Heures d'ouverture",
      value: "Lun-Ven: 8h00 - 18h00"
    }
  ];

  return (
    <section className="relative py-24" id='contact'>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-black bg-clip-text text-4xl font-bold sm:text-5xl">
            Contactez-nous
          </h1>
          <div className="w-48 m-4 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Nous serions ravis de vous entendre. Que vous ayez une question sur nos services, nos tarifs ou tout autre sujet, notre équipe est prête à répondre à toutes vos demandes.
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((method, index) => (
            <ContactMethod key={index} {...method} />
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-1 shadow-xl">
          <div className="h-full w-full overflow-hidden rounded-xl bg-white p-1">
            <iframe
              title="Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5726527330544!2d10.181673!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0x7c56c6c3cd5d6403!2s97%20Rue%20de%20Palestine%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1699372841010!5m2!1sen!2s"
              className="h-96 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Nous suivre sur les réseaux sociaux</h2>
          <div className="mt-6 flex justify-center space-x-6">
            <a href="https://www.facebook.com/profile.php?id=100057621002945&locale=gl_ES&_rdr" target='_blank' rel="noreferrer"  className="text-gray-500 hover:text-orange-600 transition-colors">
              <Icon icon="mdi:facebook" className="h-8 w-8" />
            </a>
            <a href="https://www.instagram.com/batoutavoyages_events/?hl=fr" target='_blank' rel="noreferrer" className="text-gray-500 hover:text-orange-600 transition-colors">
              <Icon icon="mdi:instagram" className="h-8 w-8" />
            </a>
            <a href="https://wa.me/21671802881" className="text-gray-500 hover:text-green-600 transition-colors">
              <Icon icon="mdi:whatsapp" className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;