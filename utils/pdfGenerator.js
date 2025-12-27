import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clean HTML content by removing tags and decoding HTML entities
 * Enhanced to handle lists and preserve line breaks
 */
const cleanHtmlContent = (html = '') => {
  if (!html) return '';
  
  // Replace common HTML structures with proper formatting
  let formatted = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<ul>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<h[1-6]>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<strong>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<em>/gi, '')
    .replace(/<\/em>/gi, '')
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
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/—/g, '-') // Replace em-dash with hyphen for better font support
    .replace(/–/g, '-') // Replace en-dash with hyphen
    .replace(/•/g, '-') // Replace bullet with hyphen
    .replace(/\u00A0/g, ' ') // Replace non-breaking space with regular space
    .replace(/[^\x00-\x7F\u00C0-\u00FF]/g, '') // Remove non-ASCII and non-Latin1 characters (like emojis)
    .replace(/<[^>]*>/g, '');

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = formatted;
    formatted = textarea.value;
  }
  
  return formatted
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces
    .trim();
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
 * Enhanced PDF generation with beautiful formatting
 */
export const generateProgramPDF = async (program) => {
  try {
    const browserInfo = detectBrowserEnvironment();
    
    // Create PDF document with better quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Enhanced color palette
    const colors = {
      primary: [234, 88, 12],      // Orange
      secondary: [249, 115, 22],    // Light orange
      dark: [26, 26, 26],           // Almost black
      gray: [75, 85, 99],           // Gray
      lightGray: [229, 231, 235],   // Light gray
      white: [255, 255, 255]
    };

    // Set margins and dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add new page with better spacing
    const checkAndAddPage = (requiredHeight = 10) => {
      if (yPosition + requiredHeight > pageHeight - 25) { // Reserve space for footer
        pdf.addPage();
        yPosition = margin + 10; // Start a bit lower on new pages
        return true;
      }
      return false;
    };

    // Helper to draw decorative line
    const drawDecorativeLine = (yPos, width = contentWidth, color = colors.primary) => {
      pdf.setDrawColor(...color);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, margin + width, yPos);
    };

    // Helper to draw section box
    const drawSectionBox = (yPos, height, fillColor = colors.lightGray) => {
      pdf.setFillColor(...fillColor);
      pdf.roundedRect(margin, yPos, contentWidth, height, 2, 2, 'F');
    };

    // Helper function to format date
    const formatDate = (date) => {
      try {
        return new Date(date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).replace(/\u00A0/g, ' ');
      } catch (e) {
        return date;
      }
    };

    // Helper to add multi-line text with better spacing
    const addTextBlock = (text, fontSize = 10, lineHeight = 6) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, contentWidth - 10);
      lines.forEach(line => {
        checkAndAddPage(lineHeight);
        pdf.text(line, margin + 5, yPosition);
        yPosition += lineHeight;
      });
    };

    // ========== COVER PAGE / HEADER ==========
    // Orange header banner
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Company name
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BATOUTA VOYAGES', margin, 20);
    
    // Tagline
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Votre partenaire pour des voyages inoubliables', margin, 28);
    
    // Decorative line
    pdf.setDrawColor(...colors.white);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 33, pageWidth - margin, 33);
    
    yPosition = 55;

    // ========== PROGRAM TITLE ==========
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    
    const titleLines = pdf.splitTextToSize(program.title, contentWidth);
    titleLines.forEach(line => {
      pdf.text(line, margin, yPosition);
      yPosition += 9;
    });
    
    yPosition += 5;
    drawDecorativeLine(yPosition);
    yPosition += 10;

    // ========== QUICK INFO BOX ==========
    const boxHeight = 55;
    drawSectionBox(yPosition, boxHeight, [254, 243, 199]); // Light orange background
    
    yPosition += 8;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Grid layout for info
    const col1X = margin + 5;
    const col2X = margin + contentWidth / 2 + 5;
    let infoY = yPosition;

    // Column 1
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('DESTINATION', col1X, infoY);
    infoY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.dark);
    const destText = `${program.location_from.toUpperCase()} -> ${program.location_to.toUpperCase()}`;
    const destLines = pdf.splitTextToSize(destText, (contentWidth / 2) - 10);
    destLines.forEach(line => {
      pdf.text(line, col1X, infoY);
      infoY += 5;
    });
    
    infoY = yPosition + 20;
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('DATES', col1X, infoY);
    infoY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.dark);
    const dateText = `Du ${formatDate(program.from_date)}`;
    const dateLines = pdf.splitTextToSize(dateText, (contentWidth / 2) - 10);
    dateLines.forEach(line => {
      pdf.text(line, col1X, infoY);
      infoY += 5;
    });
    const dateText2 = `au ${formatDate(program.to_date)}`;
    const dateLines2 = pdf.splitTextToSize(dateText2, (contentWidth / 2) - 10);
    dateLines2.forEach(line => {
      pdf.text(line, col1X, infoY);
      infoY += 5;
    });

    // Column 2
    infoY = yPosition;
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('DUREE', col2X, infoY);
    infoY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.dark);
    pdf.text(`${program.days} jours`, col2X, infoY);
    
    infoY = yPosition + 20;
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...colors.primary);
    pdf.text('PRIX', col2X, infoY);
    infoY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    const priceFormatted = (program.price?.toLocaleString('fr-FR') || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\u00C0-\u00FF\d]/g, ' ');
    pdf.text(`${priceFormatted} TND`, col2X, infoY);
    infoY += 5;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('par personne (chambre double)', col2X, infoY);
    
    if (program.singleAdon) {
      infoY += 6;
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.gray);
      const singleFormatted = program.singleAdon.toLocaleString('fr-FR')
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\x20-\x7E\u00C0-\u00FF\d]/g, ' ');
      pdf.text(`Supplement single: ${singleFormatted} TND`, col2X, infoY);
    }

    yPosition += boxHeight + 15;

    // ========== DESCRIPTION SECTION ==========
    checkAndAddPage(35);
    
    pdf.setFillColor(...colors.primary);
    pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('APERÇU DU SÉJOUR', margin + 5, yPosition + 8);
    
    yPosition += 18;
    
    pdf.setTextColor(...colors.dark);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const cleanDescription = cleanHtmlContent(program.description);
    addTextBlock(cleanDescription, 10, 6);
    
    yPosition += 10;

    // ========== TIMELINE SECTION ==========
    checkAndAddPage(35);
    
    pdf.setFillColor(...colors.primary);
    pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
    
    pdf.setTextColor(...colors.white);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ITINÉRAIRE DÉTAILLÉ', margin + 5, yPosition + 8);
    
    yPosition += 18;

    program.timeline?.forEach((item, index) => {
      checkAndAddPage(30);
      
      // Day number circle
      pdf.setFillColor(...colors.primary);
      pdf.circle(margin + 5, yPosition + 2, 4, 'F');
      pdf.setTextColor(...colors.white);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}`, margin + (index + 1 > 9 ? 3 : 3.5), yPosition + 3.5);
      
      // Day title
      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const cleanTitle = item.title.replace(/[^\x00-\x7F\u00C0-\u00FF]/g, '').replace(/[—–]/g, '-').replace(/\u00A0/g, ' ');
      // Check if title already starts with "Jour" to avoid duplication
      const dayTitle = cleanTitle.toLowerCase().startsWith('jour') ? cleanTitle : `Jour ${index + 1} : ${cleanTitle}`;
      const titleLines = pdf.splitTextToSize(dayTitle, contentWidth - 15);
      titleLines.forEach((line, idx) => {
        pdf.text(line, margin + 12, yPosition + 4 + (idx * 6));
      });
      
      yPosition += 4 + (titleLines.length * 6) + 3;
      
      // Day description with better formatting
      pdf.setTextColor(...colors.dark);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const cleanItemDescription = cleanHtmlContent(item.description);
      const itemLines = pdf.splitTextToSize(cleanItemDescription, contentWidth - 20);
      itemLines.forEach(line => {
        checkAndAddPage(6);
        pdf.text(line, margin + 12, yPosition);
        yPosition += 5.5;
      });
      
      // Separator line between days
      yPosition += 4;
      pdf.setDrawColor(...colors.lightGray);
      pdf.setLineWidth(0.3);
      pdf.line(margin + 12, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    });

    // ========== PRICE INCLUDES SECTION ==========
    if (program.priceInclude) {
      checkAndAddPage(35);
      
      pdf.setFillColor(...colors.primary);
      pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
      
      pdf.setTextColor(...colors.white);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CE QUE COMPREND LE PRIX', margin + 5, yPosition + 8);
      
      yPosition += 18;

      pdf.setTextColor(...colors.dark);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const cleanPriceInclude = cleanHtmlContent(program.priceInclude);
      addTextBlock(cleanPriceInclude, 10, 6);

      yPosition += 10;
    }

    // ========== GENERAL CONDITIONS SECTION ==========
    if (program.generalConditions) {
      checkAndAddPage(25);
      
      // Smaller, less prominent header
      pdf.setTextColor(...colors.gray);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Conditions générales', margin, yPosition);
      
      yPosition += 8;
      
      // Draw subtle line
      pdf.setDrawColor(...colors.lightGray);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      
      yPosition += 6;

      pdf.setTextColor(...colors.gray);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      const cleanConditions = cleanHtmlContent(program.generalConditions);
      addTextBlock(cleanConditions, 8, 4);
    }

    // ========== FOOTER ON ALL PAGES ==========
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      const footerY = pageHeight - 20;
      
      // Footer background
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, footerY, pageWidth, 20, 'F');
      
      // Footer content
      pdf.setTextColor(...colors.white);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Contact info
      pdf.text('Tel: +216 71 802 881', margin, footerY + 7);
      pdf.text('Email: outgoing.batouta@gmail.com', margin, footerY + 13);
      
      // Page number
      pdf.setFont('helvetica', 'bold');
      const pageText = `Page ${i}/${totalPages}`;
      const pageTextWidth = pdf.getTextWidth(pageText);
      pdf.text(pageText, pageWidth - margin - pageTextWidth, footerY + 10);
      
      // Logo or branding on the right
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const brandText = 'BATOUTA VOYAGES';
      const brandWidth = pdf.getTextWidth(brandText);
      pdf.text(brandText, (pageWidth - brandWidth) / 2, footerY + 10);
    }

    const filename = `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

    // Enhanced download strategy based on browser
    if (browserInfo.isFacebookBrowser || browserInfo.isInAppBrowser) {
      return downloadWithDataURL(pdf, filename);
    }
    
    return downloadNormally(pdf, filename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};

/**
 * Download PDF using data URL (works better in restricted browsers)
 */
const downloadWithDataURL = (pdf, filename) => {
  try {
    const pdfDataUrl = pdf.output('dataurlstring');
    
    // Method 1: Direct download with data URL
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Trigger download
    try {
      link.click();
    } catch (e) {
      // Fallback for browsers that block programmatic clicks
      link.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    // Method 2: Fallback - open in new window for manual download
    setTimeout(() => {
      // Only open new window if we're in a very restricted environment
      const isVeryRestricted = /FBAN|FBAV|Instagram/i.test(navigator.userAgent);
      if (isVeryRestricted) {
        try {
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>${filename}</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      margin: 0;
                      padding: 20px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                    .container {
                      background: white;
                      border-radius: 16px;
                      padding: 40px;
                      max-width: 600px;
                      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                      text-align: center;
                    }
                    h2 {
                      color: #1a1a1a;
                      margin-bottom: 10px;
                      font-size: 24px;
                    }
                    p {
                      color: #666;
                      margin-bottom: 30px;
                      line-height: 1.6;
                    }
                    .download-btn {
                      display: inline-block;
                      background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
                      color: white;
                      padding: 16px 40px;
                      text-decoration: none;
                      border-radius: 12px;
                      font-weight: 600;
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
                      transition: transform 0.2s, box-shadow 0.2s;
                    }
                    .download-btn:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
                    }
                    .pdf-preview {
                      margin-top: 30px;
                      border-radius: 8px;
                      overflow: hidden;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                    .icon {
                      font-size: 48px;
                      margin-bottom: 20px;
                    }
                    @media (max-width: 600px) {
                      .container { padding: 20px; }
                      .pdf-preview { height: 400px; }
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon">PDF</div>
                    <h2>Votre programme est prêt !</h2>
                    <p>Cliquez sur le bouton ci-dessous pour télécharger votre PDF.</p>
                    <a href="${pdfDataUrl}" download="${filename}" class="download-btn">
                      Télécharger le PDF
                    </a>
                    <div class="pdf-preview">
                      <embed src="${pdfDataUrl}" type="application/pdf" width="100%" height="500px" />
                    </div>
                  </div>
                </body>
              </html>
            `);
            newWindow.document.close();
          }
        } catch (popupError) {
          console.log('Could not open preview window:', popupError);
        }
      }
    }, 500);
    
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
    // Method 1: Use jsPDF's built-in save method
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Normal download failed, trying blob method:', error);
    
    // Method 2: Fallback to blob URL
    try {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      
      return true;
    } catch (blobError) {
      console.error('Blob download failed, trying data URL:', error);
      // Final fallback to data URL method
      return downloadWithDataURL(pdf, filename);
    }
  }
};

/**
 * Generate PDF with blob URL method (alternative)
 */
export const generateProgramPDFWithBlob = async (program) => {
  try {
    // This is a simplified version that uses the main generator logic
    // but returns a blob instead of triggering a download
    const pdf = await generateProgramPDF(program); 
    return pdf;
  } catch (error) {
    console.error('Blob generation failed:', error);
    throw error;
  }
};

export default {
  generateProgramPDF,
  generateProgramPDFWithBlob
};