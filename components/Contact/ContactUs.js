import React from 'react';
import { useTranslation } from 'next-i18next';
import { Icon } from '@iconify/react';

const ContactMethod = ({ icon, label, value, href }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative flex items-start gap-4">
      <div className="rounded-xl bg-orange-100/50 p-3">
        <Icon icon={icon} className="h-6 w-6 text-orange-600" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{label}</h3>
        {href ? (
          <a href={href} className="mt-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
            {value}
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
      icon: 'mdi:email',
      label: t('Contact.info.email_title'),
      value: 'batouta.info@gmail.com',
      href: 'mailto:batouta.info@gmail.com'
    },
    {
      icon: 'mdi:phone',
      label: t('Contact.info.phone_title'),
      value: t('Contact.info.phone'),
      href: 'tel:+21671802881'
    },
    {
      icon: 'mdi:map-marker',
      label: t('Contact.info.adress_title'),
      value: t('Contact.info.address')
    },   
  ];

  return (
    <section className="relative py-24" id='contact'>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-black bg-clip-text text-4xl font-bold  sm:text-5xl">
            {t('Contact.title')}
          </h1>
          <div className="w-48 m-4 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t('Contact.description')}
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((method, index) => (
            <ContactMethod key={index} {...method} />
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-1">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <iframe
              title="Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.5726527330544!2d10.181673!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0x7c56c6c3cd5d6403!2s97%20Rue%20de%20Palestine%2C%20Tunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1699372841010!5m2!1sen!2s"
              className="h-96 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
