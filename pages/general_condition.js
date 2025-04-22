// pages/general-conditions.js
import { Layout } from "components//Layout";
import SEO from "components//SEO/SEO";
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function GeneralConditions() {
  return (
    <Layout>
      <Head>
        <title>Conditions Générales - Batouta Voyages</title>
      </Head>

      <SEO
        title={"Conditions Générales"}
        description="Veuillez lire attentivement nos conditions générales avant de réserver votre voyage. Bienvenue chez Batouta Voyages. En réservant nos services, vous acceptez les conditions générales suivantes."
      />
      <div>
        {/* Hero Section */}
        <div className="bg-orange-50 top-50 h-500 text-black py-60 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-7xl font-bold mb-4">Conditions Générales</h1>
            <p className="text-black-200">
              Veuillez lire attentivement nos conditions générales avant de réserver votre voyage.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Bienvenue chez Batouta Voyages. En réservant nos services, vous acceptez les conditions générales suivantes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Réservation et Paiement</h2>
              <p className="text-gray-700 leading-relaxed">
                Un acompte est exigé au moment de la réservation. Le solde restant doit être réglé avant la date limite spécifiée.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. Politique d&apos;Annulation</h2>
              <p className="text-gray-700 leading-relaxed">
                Les annulations doivent être communiquées par e-mail. Des frais s&apos;appliquent en fonction de la date d&apos;annulation par rapport à la date de départ.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Assurance Voyage</h2>
              <p className="text-gray-700 leading-relaxed">
                Une assurance voyage, incluant une couverture COVID-19, est obligatoire et doit être souscrite par le client.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Visas et Documentation</h2>
              <p className="text-gray-700 leading-relaxed">
                Il incombe aux clients d&apos;xobtenir les visas nécessaires et de s&apos;assurer que leurs documents de voyage sont valides.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Responsabilité</h2>
              <p className="text-gray-700 leading-relaxed">
                Batouta Voyages décline toute responsabilité en cas de perte, dommage ou blessure survenus pendant le voyage. Les clients doivent souscrire une assurance appropriée.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Modifications de l&apos;Itinéraire</h2>
              <p className="text-gray-700 leading-relaxed">
                Nous nous réservons le droit de modifier l&apos;itinéraire en raison de circonstances imprévues, tout en minimisant l&apos;impact sur l&apos;expérience du voyage.
              </p>
            </section>

            <section className="mb-0">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Acceptation des Conditions</h2>
              <p className="text-gray-700 leading-relaxed">
                En réservant auprès de Batouta Voyages, vous reconnaissez et acceptez les présentes conditions générales.
              </p>
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
}
