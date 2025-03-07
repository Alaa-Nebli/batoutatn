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
        <title>General Conditions - Batouta Voyages</title>
      </Head>

            <SEO
                title={"General Conditions"}
                description="Please read our terms and conditions carefully before booking your journey. Welcome to Batouta Voyages. By booking our services, you agree to the following terms and conditions."
            />
        <div>
        {/* Hero Section */}
        <div className="bg-orange-50 top-50 h-500 text-black py-60 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-7xl font-bold mb-4">General Conditions</h1>
            <p className="text-black-200">
              Please read our terms and conditions carefully before booking your journey.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Batouta Voyages. By booking our services, you agree to the following terms and conditions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Booking and Payment</h2>
              <p className="text-gray-700 leading-relaxed">
                A deposit is required at the time of booking. The remaining balance must be paid before the specified deadline.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. Cancellation Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Cancellations must be communicated via email. Fees apply based on the cancellation date relative to the departure date.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Travel Insurance</h2>
              <p className="text-gray-700 leading-relaxed">
                Travel insurance, including COVID-19 coverage, is mandatory and should be arranged by the client.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Visas and Documentation</h2>
              <p className="text-gray-700 leading-relaxed">
                Clients are responsible for obtaining necessary visas and ensuring their travel documents are valid.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Batouta Voyages is not liable for any loss, damage, or injury during the trip. Clients should have appropriate insurance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Changes to Itinerary</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify the itinerary due to unforeseen circumstances, ensuring minimal impact on the experience.
              </p>
            </section>

            <section className="mb-0">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By booking with Batouta Voyages, you acknowledge and accept these general conditions.
              </p>
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
}