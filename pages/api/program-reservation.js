import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Parse and validate incoming data
    const {
      tripId,
      tripTitle,
      tripLocation,
      firstName,
      lastName,
      email,
      phone,
      numberOfPersons,
      roomType,
      specialRequests,
      preferredDate,
      totalPrice
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !tripId || !tripTitle) {
      return res.status(400).json({ 
        message: 'Veuillez remplir tous les champs obligatoires.' 
      });
    }

    // 2. Build the professional HTML email for the team
    const teamEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e67e22, #f39c12); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #e67e22; }
            .client-section { border-left-color: #27ae60; }
            .booking-section { border-left-color: #3498db; }
            .special-section { border-left-color: #f39c12; }
            .label { font-weight: bold; color: #2c3e50; }
            .value { color: #34495e; margin-left: 10px; }
            .highlight { background: linear-gradient(135deg, #e67e22, #f39c12); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .urgent { background: #e74c3c; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Nouvelle Demande de Réservation Programme</h1>
              <p>Une nouvelle demande de réservation a été reçue via le site web</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h3 style="color: #e67e22; margin-top: 0;">📍 Programme Demandé</h3>
                <p><span class="label">Titre:</span><span class="value">${tripTitle}</span></p>
                <p><span class="label">Destination:</span><span class="value">${tripLocation}</span></p>
                <p><span class="label">ID Programme:</span><span class="value">${tripId}</span></p>
              </div>
              
              <div class="section client-section">
                <h3 style="color: #27ae60; margin-top: 0;">👤 Informations Client</h3>
                <p><span class="label">Nom complet:</span><span class="value">${firstName} ${lastName}</span></p>
                <p><span class="label">Email:</span><span class="value">${email}</span></p>
                <p><span class="label">Téléphone:</span><span class="value">${phone}</span></p>
              </div>
              
              <div class="section booking-section">
                <h3 style="color: #3498db; margin-top: 0;">🎯 Détails de la Réservation</h3>
                <p><span class="label">Nombre de personnes:</span><span class="value">${numberOfPersons}</span></p>
                <p><span class="label">Type de chambre:</span><span class="value">${roomType}</span></p>
                <p><span class="label">Période souhaitée:</span><span class="value">${preferredDate || 'Non spécifiée'}</span></p>
                <p><span class="label">Prix estimé:</span><span class="value">${totalPrice ? `${totalPrice.toLocaleString('fr-FR')} TND` : 'À calculer'}</span></p>
              </div>
              
              ${specialRequests ? `
                <div class="section special-section">
                  <h3 style="color: #f39c12; margin-top: 0;">✨ Demandes Spéciales</h3>
                  <p>${specialRequests}</p>
                </div>
              ` : ''}
              
              <div class="urgent">
                📞 ACTION REQUISE: Contacter le client dans les plus brefs délais
              </div>
              
              <p style="text-align: center; color: #7f8c8d; font-size: 14px; margin-top: 30px;">
                Email généré automatiquement le ${new Date().toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // 3. Send to your back-office
    await resend.emails.send({
      from:    'Batouta Voyages <outgoing@batouta.tn>',
      to:      ['outgoing.batouta@gmail.com'],   
      subject: `Nouvelle réservation Voyage – ${firstName} ${lastName}`,
      html: teamEmailHtml,
    });

    // 4. Send professional confirmation to the client
    const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #e67e22, #f39c12); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .trip-card { background: white; border: 2px solid #e67e22; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
          .summary { background: white; border-left: 4px solid #27ae60; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .contact-info { background: #e8f5e8; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
          .highlight { color: #e67e22; font-weight: bold; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Demande de Réservation Reçue</h1>
            <p>Merci pour votre confiance, ${firstName}!</p>
          </div>
          
          <div class="content">
            <p>Cher(e) <strong>${firstName} ${lastName}</strong>,</p>
            <p>Nous avons bien reçu votre demande de réservation et vous remercions de votre confiance. Notre équipe examinera votre demande et vous contactera très prochainement.</p>

            <div class="trip-card">
              <h3 style="color: #e67e22; margin-top: 0;">Votre Programme Sélectionné</h3>
              <h4>${tripTitle}</h4>
              <p style="color: #666;">${tripLocation}</p>
            </div>

            <div class="summary">
              <h3 style="color: #27ae60; margin-top: 0;">Récapitulatif de votre Demande</h3>
              <ul>
                <li><strong>Nombre de personnes:</strong> ${numberOfPersons}</li>
                <li><strong>Type de chambre:</strong> ${roomType}</li>
                ${preferredDate ? `<li><strong>Période souhaitée:</strong> ${preferredDate}</li>` : ''}
                ${totalPrice ? `<li><strong>Prix estimé:</strong> ${totalPrice.toLocaleString('fr-FR')} TND</li>` : ''}
              </ul>
              ${specialRequests ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #bdc3c7;">
                  <strong>Vos demandes spéciales:</strong>
                  <p style="font-style: italic; color: #555;">${specialRequests}</p>
                </div>
              ` : ''}
            </div>

            <div class="contact-info">
              <h3 style="color: #2c3e50; margin-top: 0;">Prochaines Étapes</h3>
              <p>Notre équipe vous contactera sous <span class="highlight">24 heures maximum</span> au <strong>${phone}</strong> pour :</p>
              <ul style="text-align: left; max-width: 300px; margin: 15px auto;">
                <li>Confirmer les détails de votre voyage</li>
                <li>Vous proposer les meilleures options disponibles</li>
                <li>Finaliser votre réservation</li>
                <li>Répondre à toutes vos questions</li>
              </ul>
              <p><strong>Email:</strong> outgoing.batouta@gmail.com</p>
              <p><strong>Téléphone:</strong> +216 XX XXX XXX</p>
            </div>

            <p>En attendant notre appel, n'hésitez pas à nous contacter si vous avez des questions ou des modifications à apporter à votre demande.</p>
            
            <p style="color: #e67e22; font-weight: bold; text-align: center; margin-top: 30px;">
              L'équipe Batouta Voyages vous remercie de votre confiance !
            </p>
          </div>

          <div class="footer">
            <p>Batouta Voyages - Votre partenaire de confiance pour tous vos voyages</p>
            <p>www.batouta.tn | outgoing.batouta@gmail.com</p>
          </div>
        </div>
      </body>
    </html>`;


    // 5. Acknowledge to the user
    await resend.emails.send({
      from:    'Batouta Voyages <outgoing@batouta.tn>',
      to:      [email],
      subject: 'Votre demande de réservation de voyage a bien été reçue',
      html: clientEmailHtml
    });

    return res.status(200).json({ message: 'Demande de réservation envoyée avec succès' });
  } catch (error) {
    console.error('Error sending program reservation request:', error);
    return res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
}
