// OurPrograms.js
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components/Contact";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const ProgramCard = ({ program }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative h-64 w-full overflow-hidden">
      <Image
        src={program.coverImage}
        alt={program.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
        {program.title}
      </h3>
      <p className="text-gray-600 mt-2 mb-4 line-clamp-3">
        {program.shortDescription}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Icon icon="mdi:calendar" className="w-5 h-5 mr-1" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center">
            <Icon icon="mdi:map-marker" className="w-5 h-5 mr-1" />
            <span>{program.destination}</span>
          </div>
        </div>
        <Link href={`/programs/${program.id}`}>
            Explore
            <Icon icon="mdi:arrow-right" className="ml-1" />
        </Link>
      </div>
    </div>
  </motion.div>
);

export default function OurPrograms() {
  const { t } = useTranslation('common');

  const programs = [
    {
      id: 1,
      title: "Discover Tunisia: Historical Journey",
      shortDescription: "Explore the rich historical heritage of Tunisia, from ancient Carthage to Roman ruins.",
      coverImage: "/tunisia/carthage-tunis-tunisia.jpg",
      duration: "7 Days",
      destination: "Tunis, Carthage, Dougga",
    },
    {
      id: 2,
      title: "Sahara Desert Adventure",
      shortDescription: "Experience the magic of the Tunisian Sahara, with desert landscapes and traditional Berber culture.",
      coverImage: "/tunisia/Chott-Jerid-Tunisia.jpg",
      duration: "5 Days",
      destination: "Tozeur, Douz, Ksar Ghilane",
    },
    {
      id: 3,
      title: "Coastal Wonders of Tunisia",
      shortDescription: "A journey through Tunisia's stunning Mediterranean coastline, exploring charming seaside towns and pristine beaches.",
      coverImage: "/tunisia/sidi_bou_said.jpg",
      duration: "6 Days",
      destination: "Sidi Bou Said, Hammamet, Monastir",
    },
    {
      id: 4,
      title: "Cultural Immersion Experience",
      shortDescription: "Dive deep into Tunisian culture, traditions, cuisine, and local way of life across different regions.",
      coverImage: "/tunisia/tunisia_art.webp",
      duration: "8 Days",
      destination: "Various Cities",
    },
  ];

  return (
    <Layout>
      <SEO
        title="Our Travel Programs"
        description="Discover our curated travel experiences across Tunisia"
      />
      <div className="main-wrapper bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/tunisia/tunisia_landscapes.jpg"
              layout="fill"
              objectFit="cover"
              alt="Tunisia Travel Programs"
              className="opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center max-w-4xl px-4"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Extraordinary Journeys Await
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Discover meticulously crafted travel experiences that reveal the heart and soul of Tunisia.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#programs"
                className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-lg flex items-center"
              >
                View Programs
                <Icon icon="mdi:arrow-down" className="ml-2" />
              </a>
              <Link href="/contact">
                  Custom Trip
              </Link>
            </div>
          </motion.div>
        </section>

        <section id="programs" className="py-20 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-5xl font-bold text-gray-800">
        Curated Travel Experiences
      </h2>
      <p className="text-xl text-gray-600 mt-4">
        From ancient historical sites to breathtaking landscapes, our programs are designed to immerse you in the essence of Tunisia.
      </p>
    </motion.div>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  </div>
</section>

<ContactUs />
      </div>
    </Layout>
  );
}
