import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      departureCity,
      arrivalCity,
      departureDate,
      returnDate,
      passengers,
      classType,
      specialRequests
    } = req.body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !phone || !departureCity || !arrivalCity || !departureDate) {
      return res.status(400).json({ 
        message: 'Veuillez remplir tous les champs obligatoires.' 
      });
    }

    const ticketType = returnDate ? 'Aller-retour' : 'Aller simple';
    const classNames = {
      economy: 'Économique',
      business: 'Affaires',
      first: 'Première classe'
    };

    // Email à l'équipe Batouta
    const teamEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6; }
            .label { font-weight: bold; color: #1e40af; font-size: 14px; text-transform: uppercase; }
            .value { color: #374151; font-size: 16px; margin-top: 5px; }
            .highlight { background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
            .special-requests { background: #fef7cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Nouvelle Demande de Billetterie</h1>
              <p>Une nouvelle demande de devis billetterie a été reçue via le site web</p>
            </div>
            
            <div class="content">
              <h2>Informations du Client</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Nom complet</div>
                  <div class="value">${firstName} ${lastName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Email</div>
                  <div class="value">${email}</div>
                </div>
                <div class="info-item">
                  <div class="label">Téléphone</div>
                  <div class="value">${phone}</div>
                </div>
                <div class="info-item">
                  <div class="label">Nombre de passagers</div>
                  <div class="value">${passengers} passager${passengers > 1 ? 's' : ''}</div>
                </div>
              </div>

              <div class="highlight">
                <h3>Détails du Vol Demandé</h3>
                <p><strong>De:</strong> ${departureCity}</p>
                <p><strong>Vers:</strong> ${arrivalCity}</p>
                <p><strong>Type:</strong> ${ticketType}</p>
                <p><strong>Classe:</strong> ${classNames[classType] || classType}</p>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Date de départ</div>
                  <div class="value">${new Date(departureDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
                ${returnDate ? `
                <div class="info-item">
                  <div class="label">Date de retour</div>
                  <div class="value">${new Date(returnDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
                ` : '<div class="info-item"><div class="label">Vol</div><div class="value">Aller simple</div></div>'}
              </div>

              ${specialRequests ? `
                <div class="special-requests">
                  <strong>🗒️ Demandes spéciales:</strong>
                  <p>${specialRequests}</p>
                </div>
              ` : ''}

              <p style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #0284c7;">
                <strong>📧 Action requise:</strong> Veuillez contacter le client dans les plus brefs délais pour lui proposer les meilleures options de vol et tarifs disponibles.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email de confirmation au client
    const clientEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .summary { background: white; border: 2px solid #3B82F6; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .contact-info { background: #e0f2fe; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .route { font-size: 24px; font-weight: bold; color: #1e40af; margin: 15px 0; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: black;"> Demande de Billetterie Reçue</h1>
              <p style="color: black;">Merci pour votre confiance, ${firstName}!</p>
            </div>
            
            <div class="content">
              <p>Cher(e) ${firstName} ${lastName},</p>
              
              <p>Nous avons bien reçu votre demande de devis pour votre voyage. Notre équipe spécialisée en billetterie va étudier votre demande et vous proposer les meilleures options disponibles.</p>

              <div class="summary">
                <h3> Récapitulatif de votre demande</h3>
                <div class="route">${departureCity} ✈️ ${arrivalCity}</div>
                
                <div class="detail">
                  <span class="label">Type de vol:</span> ${ticketType}
                </div>
                <div class="detail">
                  <span class="label">Date de départ:</span> ${new Date(departureDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                ${returnDate ? `
                <div class="detail">
                  <span class="label">Date de retour:</span> ${new Date(returnDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                ` : ''}
                <div class="detail">
                  <span class="label">Nombre de passagers:</span> ${passengers} passager${passengers > 1 ? 's' : ''}
                </div>
                <div class="detail">
                  <span class="label">Classe:</span> ${classNames[classType] || classType}
                </div>
              </div>

              <div class="contact-info">
                <h3>📞 Prochaines étapes</h3>
                <p>Notre équipe vous contactera sous <strong>24 heures</strong> avec:</p>
                <ul style="text-align: left; max-width: 300px; margin: 15px auto;">
                  <li>Les meilleures options de vol disponibles</li>
                  <li>Des tarifs négociés et compétitifs</li>
                  <li>Toutes les informations pratiques</li>
                </ul>
                <p><strong>Téléphone:</strong> +216 XX XXX XXX</p>
                <p><strong>Email:</strong> ticketing.batouta@gmail.com</p>
              </div>

              <p>En attendant, n'hésitez pas à nous contacter si vous avez des questions ou des modifications à apporter à votre demande.</p>
              
              <p>L'équipe Batouta Voyages vous remercie de votre confiance.</p>
              
              <p style="margin-top: 30px; font-style: italic; color: #6b7280;">
                Batouta Voyages - Votre partenaire de confiance pour tous vos voyages<br>
                🌐 www.batouta.tn | 📧 ticketing.batouta@gmail.com
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoi des emails
    await Promise.all([
      // Email à l'équipe
      resend.emails.send({
        from: `Batouta Voyages <ticketing@batouta.tn>`,
        to: "ticketing.batouta@gmail.com",
        subject: `🎫 Nouvelle demande billetterie - ${firstName} ${lastName}`,
        html: teamEmailContent
      }),

      // Email de confirmation au client
      resend.emails.send({
        from: `Batouta Voyages <ticketing@batouta.tn>`,
        to: [email],
        subject: '✈️ Confirmation de votre demande de billetterie - Batouta Voyages',
        html: clientEmailContent
      })
    ]);

    res.status(200).json({ 
      message: 'Demande de billetterie envoyée avec succès!' 
    });

  } catch (error) {
    console.error('Error sending ticketing request:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.' 
    });
  }
}
