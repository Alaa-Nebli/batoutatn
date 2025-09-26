import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import { ContactUs } from "components/Contact";
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { ContactUs } from "components/Contact";
import { useRouter } from 'next/router';

const ProgramHeaderCard = ({ program }) => {
  const formatDate = (date, options = {}) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options,
    });

  return (
    <article
      aria-label={`Détails du programme ${program.title}`}
      className=" bg-white rounded-lg p-8 shadow-lg mb-10 printable-section border border-gray-200"
    >
      {/* Program title with decorative element */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 w-16 h-2 bg-orange-500 rounded-full" aria-hidden="true"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 pt-6 leading-tight">
          {program.title}
        </h1>
        <h4 className="text-2xl md:text-2xl font-bold text-gray-800 mb-4">
  Du {formatDate(program.from_date, { year: undefined })} au {formatDate(program.to_date)}
</h4>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section aria-labelledby="destination-label" className="mb-6">
          <h2 id="destination-label" className="font-semibold text-gray-800 text-2xl mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Destination
          </h2>
          <p className="text-gray-700 text-lg select-text flex items-center gap-3" aria-describedby="destination-desc">
            <span className="font-medium">{program.location_from}</span>
            <span aria-hidden="true" className="text-orange-500 text-2xl">→</span>
            <span className="font-medium">{program.location_to}</span>
          </p>
          <p id="destination-desc" className="sr-only">De {program.location_from} vers {program.location_to}</p>
        </section>

        <section aria-labelledby="dates-label" className="mb-6">
          <h2 id="dates-label" className="font-semibold text-gray-800 text-2xl mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Dates
          </h2>
          <p className="text-gray-700 text-lg select-text font-medium">
            {formatDate(program.from_date)} - {formatDate(program.to_date)}
          </p>
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section aria-labelledby="duration-label" className="mb-6">
          <h2 id="duration-label" className="font-semibold text-gray-800 text-2xl mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Durée
          </h2>
          <p className="text-gray-700 text-lg select-text font-medium">{program.days} jours</p>
        </section>       

        <section aria-label="Tarification" className="mb-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <p className="text-sm text-gray-700 mb-2 uppercase tracking-wide font-medium">À partir de</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-orange-600" aria-label="Prix par personne">
                {program.price ? program.price.toLocaleString('fr-FR') : '...'}
              </span>
              <span className="text-base text-gray-700 pb-0.5 font-medium">TND / Personne</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">en chambre double</p>

            {program.singleAdon && (
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="text-sm text-gray-700 mb-1 uppercase tracking-wide font-medium">Supplément single</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-orange-600" aria-label="Supplément single">
                    {program.singleAdon.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-base text-gray-700 pb-0.5 font-medium">TND / Personne</span>
                </div>
              </div>
            )}
          </div>
           
        </section>

        
        <section aria-labelledby="duration-label" className="mb-6">
        <a
                        href="tel:+21671030303"
                        aria-label="Appelez votre conseiller"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
                      >
                        Appelez votre conseiller
                        <span className="hidden md:inline ml-2">+216 {program.phone}</span>
              </a>
        </section>
      </div>
    </article>
  );
};

const ActionButtons = ({ onPrint, onShare, onDownloadPDF, onDownloadText }) => {
  return (
    <div className="no-print fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
     
      <button
        onClick={onDownloadPDF}
        aria-label="Télécharger en PDF"
        className="px-5 py-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors flex items-center"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        PDF
      </button>
      <button
        onClick={onPrint}
        aria-label="Imprimer la page"
        className="px-5 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors flex items-center"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Imprimer
      </button>
      <button
        onClick={onShare}
        aria-label="Partager le programme"
        className="px-5 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors flex items-center"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partager
      </button>
    </div>
  );
};

const TimelineDay = ({ day, title, description }) => {
  return (
    <article className="relative pl-10 pb-10 border-l-2 border-orange-200 last:border-l-0 last:pb-0">
      <div className="absolute left-0 top-0 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold">
        {day}
      </div>
      <h3 className="text-xl font-bold text-orange-600 mb-3 leading-snug">
        {title}
      </h3>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </article>
  );
};

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
};

export default function ProgramSimplified() {
  const router = useRouter();
  const { id } = router.query;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/programs.controller?id=${id}`);
        if (!response.ok) throw new Error('Programme non trouvé');

        const data = await response.json();
        const programData = Array.isArray(data) ? data[0] : data;

        if (!programData) throw new Error('Programme non trouvé');

        setProgram(programData);
      } catch (err) {
        setError(err.message || 'Échec du chargement des détails du programme');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: program?.title || 'Programme de voyage',
          text: `Découvrez ce programme de voyage: ${program?.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        const shareUrl = `mailto:?subject=${encodeURIComponent(program?.title || 'Programme de voyage')}&body=${encodeURIComponent(`Découvrez ce programme: ${window.location.href}`)}`;
        window.open(shareUrl, '_blank');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownloadText = () => {
    if (!program) return;
    
    const formatDate = (dateString) => {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const date = new Date(dateString);
      return isNaN(date) ? '' : date.toLocaleDateString('fr-FR', options);
    };

    let textContent = `${program.title}\n\n`;
    textContent += `Destination: ${program.location_from} → ${program.location_to}\n`;
    textContent += `Dates: ${formatDate(program.from_date)} - ${formatDate(program.to_date)}\n`;
    textContent += `Durée: ${program.days} jours\n`;
    textContent += `Prix: ${program.price ? program.price.toLocaleString('fr-FR') : '...'} TND / Personne en chambre double\n`;
    if (program.singleAdon) {
      textContent += `Supplément single: ${program.singleAdon.toLocaleString('fr-FR')} TND / Personne\n`;
    }
    
    textContent += `\nAperçu du séjour:\n${stripHtml(program.description)}\n\n`;
    
    textContent += `Itinéraire détaillé:\n`;
    program.timeline.forEach((item, idx) => {
      textContent += `\nJour ${idx + 1}: ${item.title}\n`;
      textContent += `${stripHtml(item.description)}\n`;
    });
    
    textContent += `\nCe prix comprend & ne comprend pas:\n${stripHtml(program.priceInclude || '')}\n\n`;
    textContent += `Conditions générales du voyage:\n${stripHtml(program.generalConditions || '')}\n`;
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Added function to generate and download PDF 
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-t-4 border-orange-300 border-solid rounded-full animate-spin"></div>
            </div>
            <p className="text-orange-600 text-xl font-semibold">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <main className="min-h-screen flex items-center justify-center flex-col bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-2xl font-semibold text-red-600 mb-6" role="alert">
              {error || 'Programme non trouvé'}
            </p>
            <Link href="/programs" passHref>
              <a
                className="inline-block px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
                aria-label="Voir tous les programmes"
              >
                Voir tous les programmes
              </a>
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout className="mt-20">
      <SEO
        title={`${program.title} | Batouta Voyages`}
        description={
          program.description
            ? program.description.replace(/<[^>]+>/g, '').substring(0, 160)
            : "Programme"
        }
        image={program.images && program.images[0]}
      />

      <ActionButtons 
        onPrint={handlePrint} 
        onShare={handleShare}
        onDownloadPDF={handleDownloadPDF}
        onDownloadText={handleDownloadText} 
      />

      {/* Global print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          html, body {
            width: 210mm;
            height: 297mm;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            background: white;
          }
          
          .no-print,
          button,
          nav,
          footer {
            display: none !important;
          }
          
          img,
          svg:not(.print-icon),
          .swiper,
          .swiper-slide,
          .gallery {
            display: none !important;
          }
          
          .printable-section {
            width: 100%;
            padding: 15px;
            margin-bottom: 20px;
            page-break-inside: avoid;
            break-inside: avoid;
            border: none !important;
            box-shadow: none !important;
          }
          
          h1, h2, h3, h4 {
            page-break-after: avoid;
            break-after: avoid;
            color: #000 !important;
            margin-top: 1.5em;
          }
          
          h1 {
            font-size: 24pt !important;
            margin-bottom: 1em !important;
          }
          
          h2 {
            font-size: 18pt !important;
            border-bottom: 1pt solid #ddd;
            padding-bottom: 5pt;
            margin-bottom: 10pt;
          }
          
          h3 {
            font-size: 14pt !important;
          }
          
          article {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          p, li {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .print-timeline-day {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 20pt;
            padding-left: 25pt;
            position: relative;
          }
          
          .print-timeline-day::before {
            content: "";
            position: absolute;
            left: 10pt;
            top: 0;
            bottom: 0;
            width: 1pt;
            background-color: #ddd;
          }
          
          .print-timeline-circle {
            position: absolute;
            left: 5pt;
            top: 2pt;
            width: 12pt;
            height: 12pt;
            border-radius: 50%;
            background-color: #ff6b00;
            color: white;
            font-weight: bold;
            font-size: 8pt;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translateX(-50%);
          }
          
          .print-header {
            border-bottom: 1pt solid #ddd;
            padding-bottom: 15pt;
            margin-bottom: 15pt;
          }
          
          .print-logo {
            text-align: center;
            margin-bottom: 10pt;
            font-size: 18pt;
            font-weight: bold;
            color: #ff6b00;
          }
          
          .print-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15pt;
          }
          
          .print-info-box {
            border: 1pt solid #eee;
            padding: 10pt;
            border-radius: 5pt;
          }
          
          .print-info-label {
            font-weight: bold;
            margin-bottom: 5pt;
            color: #555;
            font-size: 10pt;
            text-transform: uppercase;
          }
          
          .print-info-value {
            font-size: 12pt;
          }
          
          .print-price-box {
            background-color: #fff8f0;
            border: 1pt solid #ffe0c0;
            padding: 15pt;
            margin-top: 20pt;
            border-radius: 5pt;
          }
          
          .print-section {
            margin-bottom: 20pt;
          }
          
          ul, ol {
            padding-left: 20pt;
          }
          
          li {
            margin-bottom: 5pt;
          }
          
          .print-footer {
            text-align: center;
            font-size: 9pt;
            color: #666;
            margin-top: 30pt;
            padding-top: 10pt;
            border-top: 1pt solid #eee;
          }
          
          /* Print specific header for PDF */
          .print-only {
            display: block !important;
          }
        }
        
        /* Enhanced readability for seniors */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        h1, h2, h3, h4 {
          color: #333;
          font-weight: bold;
        }
        
        p, li {
          font-size: 18px;
          line-height: 1.6;
          color: #444;
        }
        
        .prose {
          font-size: 19px !important;
          line-height: 1.7 !important;
        }
        
        .prose strong {
          color: #000;
        }
        
        .prose ul, .prose ol {
          margin-left: 1.5em;
          padding-left: 0;
        }
        
        .prose li {
          margin-bottom: 0.75em;
        }
        
        /* Only visible when printing */
        .print-only {
          display: none;
        }
      `}</style>

      <main className="py-12 bg-gray-100 min-h-screen" id="printable-content">
        
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <ProgramHeaderCard program={program} />

          <section className="bg-white p-8 rounded-lg shadow-lg mb-10 printable-section border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-10 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Aperçu du séjour</h2>
            </div>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </section>

          <section className="mb-12 printable-section bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center mb-8">
              <div className="w-1 h-10 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Itinéraire détaillé</h2>
            </div>
            
            <div className="space-y-12">
              {program.timeline.map((timelineItem, idx) => (
                <TimelineDay 
                  key={idx} 
                  day={idx + 1} 
                  title={timelineItem.title} 
                  description={timelineItem.description}
                />
              ))}
            </div>
          </section>

          <section className="printable-section mb-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-10 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Ce prix comprend & ne comprend pas
              </h2>
            </div>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.priceInclude || '' }}
            />
          </section>

          <section className="printable-section mb-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-10 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Conditions générales du voyage
              </h2>
            </div>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.generalConditions || '' }}
            />
          </section>
          
          <section className="printable-section no-print mb-12 bg-orange-50 p-8 rounded-lg border border-orange-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-1 h-10 bg-orange-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-orange-700">Pour plus d&apos;informations</h2>
            </div>
            <p className="mb-6 text-lg">Contactez-nous pour réserver ou poser vos questions :</p>
            <ContactUs simpleForm={true} />
          </section>
          
          {/* Print-only footer */}
          <div className="print-only print-footer">
            <p>Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
            <p>© Batouta Voyages - Tous droits réservés</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}