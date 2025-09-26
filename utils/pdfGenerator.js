import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clean HTML content by removing tags and decoding HTML entities
 */
const cleanHtmlContent = (html = '') => {
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    const withoutTags = html.replace(/<[^>]*>/g, '');
    textarea.innerHTML = withoutTags;
    return textarea.value
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    const withoutTags = html.replace(/<[^>]*>/g, '');
    return withoutTags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&hellip;/g, '...')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/\s+/g, ' ')
      .trim();
  }
};

/**
 * Detect browser type and capabilities
 */
const detectBrowserEnvironment = () => {
  const userAgent = navigator.userAgent;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter|Line|WhatsApp|LinkedIn/i.test(userAgent);
  const isFacebookBrowser = /FBAN|FBAV/i.test(userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  return {
    isInAppBrowser,
    isFacebookBrowser,
    isMobile,
    isIOS,
    isAndroid,
    supportsDownload: !isInAppBrowser || (isAndroid && isFacebookBrowser)
  };
};

/**
 * Enhanced PDF generation with multiple fallback strategies
 */
export const generateProgramPDF = async (program) => {
  try {
    const browserInfo = detectBrowserEnvironment();
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set margins and dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkAndAddPage = (requiredHeight = 20) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Helper function to format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    // Add header with logo space and title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BATOUTA VOYAGES', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(16);
    pdf.setTextColor(255, 122, 0);
    pdf.text(program.title, margin, yPosition);
    yPosition += 15;

    pdf.setTextColor(0, 0, 0);

    // Program details section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Destination
    pdf.setFont('helvetica', 'bold');
    pdf.text('Destination:', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${program.location_from} → ${program.location_to}`, margin + 25, yPosition);
    yPosition += 7;

    // Dates
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dates:', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${formatDate(program.from_date)} - ${formatDate(program.to_date)}`, margin + 15, yPosition);
    yPosition += 7;

    // Duration
    pdf.setFont('helvetica', 'bold');
    pdf.text('Durée:', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${program.days} jours`, margin + 15, yPosition);
    yPosition += 7;

    // Price
    pdf.setFont('helvetica', 'bold');
    pdf.text('Prix:', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${program.price?.toLocaleString('fr-FR')} TND / personne`, margin + 12, yPosition);
    yPosition += 15;

    // Single supplement if exists
    if (program.singleAdon) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Supplément single:', margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${program.singleAdon.toLocaleString('fr-FR')} TND`, margin + 40, yPosition);
      yPosition += 15;
    }

    // Description section
    checkAndAddPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('APERÇU DU SÉJOUR', margin, yPosition);
    yPosition += 10;

    const cleanDescription = cleanHtmlContent(program.description);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const descriptionLines = pdf.splitTextToSize(cleanDescription, contentWidth);
    descriptionLines.forEach(line => {
      checkAndAddPage();
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 10;

    // Timeline section
    checkAndAddPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ITINÉRAIRE DÉTAILLÉ', margin, yPosition);
    yPosition += 15;

    program.timeline?.forEach((item, index) => {
      checkAndAddPage(25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 122, 0);
      pdf.text(`Jour ${index + 1}: ${item.title}`, margin, yPosition);
      yPosition += 8;

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const cleanItemDescription = cleanHtmlContent(item.description);
      const itemLines = pdf.splitTextToSize(cleanItemDescription, contentWidth);
      itemLines.forEach(line => {
        checkAndAddPage();
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      
      yPosition += 8;
    });

    // Price includes section
    if (program.priceInclude) {
      checkAndAddPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CE QUE COMPREND LE PRIX', margin, yPosition);
      yPosition += 10;

      const cleanPriceInclude = cleanHtmlContent(program.priceInclude);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const priceIncludeLines = pdf.splitTextToSize(cleanPriceInclude, contentWidth);
      priceIncludeLines.forEach(line => {
        checkAndAddPage();
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 10;
    }

    // General conditions section
    if (program.generalConditions) {
      checkAndAddPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CONDITIONS GÉNÉRALES', margin, yPosition);
      yPosition += 10;

      const cleanConditions = cleanHtmlContent(program.generalConditions);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const conditionsLines = pdf.splitTextToSize(cleanConditions, contentWidth);
      conditionsLines.forEach(line => {
        checkAndAddPage();
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    // Footer with contact info
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      pdf.text('BATOUTA VOYAGES - Tel: +216 71 802 881 - Email: outgoing.batouta@gmail.com', margin, pageHeight - 10);
      pdf.text(`Page ${i} sur ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    }

    const filename = `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Strategy 1: Use Data URL for Facebook and other restricted browsers
    if (browserInfo.isFacebookBrowser || browserInfo.isInAppBrowser) {
      return downloadWithDataURL(pdf, filename);
    }
    
    // Strategy 2: Normal download for regular browsers
    return downloadNormally(pdf, filename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};

/**
 * Download PDF using data URL (works in Facebook browser)
 */
const downloadWithDataURL = (pdf, filename) => {
  try {
    const pdfDataUrl = pdf.output('dataurlstring');
    
    // Method 1: Create invisible link with data URL
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Method 2 Fallback: Open in new window if link doesn't work
    setTimeout(() => {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${filename}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif;">
              <h2>Téléchargement PDF</h2>
              <p>Si le téléchargement ne démarre pas automatiquement:</p>
              <a href="${pdfDataUrl}" download="${filename}" style="background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px;">
                Télécharger le PDF
              </a>
              <br><br>
              <embed src="${pdfDataUrl}" type="application/pdf" width="100%" height="600px" />
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Data URL download failed:', error);
    throw error;
  }
};

/**
 * Normal PDF download for regular browsers
 */
const downloadNormally = (pdf, filename) => {
  try {
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Normal download failed:', error);
    // Fallback to data URL method
    return downloadWithDataURL(pdf, filename);
  }
};

/**
 * Generate PDF with blob URL method (alternative)
 */
export const generateProgramPDFWithBlob = async (program) => {
  try {
    const pdf = await generatePDFDocument(program); // Your existing PDF creation logic
    const filename = `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    // Create blob
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    
    return true;
  } catch (error) {
    console.error('Blob download failed:', error);
    throw error;
  }
};

export default {
  generateProgramPDF,
  generateProgramPDFWithBlob
};