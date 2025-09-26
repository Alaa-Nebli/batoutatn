import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clean HTML content by removing tags and decoding HTML entities
 * @param {string} html - HTML content to clean
 * @returns {string} - Clean text
 */
const cleanHtmlContent = (html = '') => {
  if (typeof document !== 'undefined') {
    // Browser environment - use DOM to decode entities
    const textarea = document.createElement('textarea');
    const withoutTags = html.replace(/<[^>]*>/g, '');
    textarea.innerHTML = withoutTags;
    return textarea.value
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  } else {
    // Server environment - manual entity decoding
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
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
};

/**
 * Generate PDF from program data
 * @param {Object} program - Program data
 * @returns {Promise<void>}
 */
export const generateProgramPDF = async (program) => {
  try {
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
    pdf.setTextColor(255, 122, 0); // Orange color
    pdf.text(program.title, margin, yPosition);
    yPosition += 15;

    // Reset color
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

    // Clean HTML description
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

    // Timeline items
    program.timeline?.forEach((item, index) => {
      checkAndAddPage(25);
      
      // Day header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 122, 0);
      pdf.text(`Jour ${index + 1}: ${item.title}`, margin, yPosition);
      yPosition += 8;

      // Day description
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
      
      // Footer line
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Contact info
      pdf.text('BATOUTA VOYAGES - Tel: +216 71 802 881 - Email: outgoing.batouta@gmail.com', margin, pageHeight - 10);
      pdf.text(`Page ${i} sur ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    }

    // Generate filename
    const filename = `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Download PDF
    pdf.save(filename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};

/**
 * Generate PDF from HTML element (fallback method)
 * @param {string} elementId - ID of HTML element to convert
 * @param {string} filename - Name of the PDF file
 * @returns {Promise<void>}
 */
export const generatePDFFromHTML = async (elementId, filename = 'document.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);

  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};

export default {
  generateProgramPDF,
  generatePDFFromHTML
};