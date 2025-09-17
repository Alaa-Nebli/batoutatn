import { Resend } from 'resend';
import invariant from 'tiny-invariant';

invariant(process.env.RESEND_API_KEY, 'Missing RESEND_API_KEY');
invariant(process.env.RESEND_FROM,     'Missing RESEND_FROM');
invariant(process.env.RESEND_TO,       'Missing RESEND_TO');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Parse incoming data
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
    } = req.body

    // 2. Build the HTML payload
    const html = `
      <h2>🌟 Nouvelle réservation de programme</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #e67e22;">Programme sélectionné</h3>
        <p><strong>Titre:</strong> ${tripTitle}</p>
        <p><strong>Destination:</strong> ${tripLocation}</p>
        <p><strong>ID du programme:</strong> ${tripId}</p>
      </div>
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #27ae60;">Informations du client</h3>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2196f3;">Détails de la réservation</h3>
        <p><strong>Nombre de personnes:</strong> ${numberOfPersons}</p>
        <p><strong>Type de chambre:</strong> ${roomType}</p>
        <p><strong>Date préférée:</strong> ${preferredDate || 'Non spécifiée'}</p>
        <p><strong>Prix estimé:</strong> ${totalPrice ? `${totalPrice.toLocaleString('fr-FR')} TND` : 'À calculer'}</p>
      </div>
      
      ${specialRequests ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ff9800;">Demandes spéciales</h3>
          <p>${specialRequests}</p>
        </div>
      ` : ''}
      
      <hr style="margin: 30px 0;"/>
      <p style="color: #666; font-size: 14px;">Cette demande nécessite un suivi rapide.</p>
    `;

    // 3. Send to your back-office
    await resend.emails.send({
      from:    process.env.RESEND_FROM,  
      to:      [process.env.RESEND_TO],   
      subject: `🌟 Nouvelle réservation programme – ${firstName} ${lastName}`,
      html,
    });

    // 4. Acknowledge to the user
    await resend.emails.send({
      from:    process.env.RESEND_FROM,
      to:      [email],
      subject: 'Votre demande de réservation de voyage a bien été reçue ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e67e22;">Bonjour ${firstName},</h2>
          
          <p>Nous avons bien reçu votre demande de réservation pour le programme :</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong>${tripTitle}</strong><br/>
            <span style="color: #666;">${tripLocation}</span>
          </div>
          
          <p>Nos experts vont examiner votre demande et vous contacterons très bientôt au <strong>${phone}</strong> pour finaliser votre réservation et vous proposer les meilleures options.</p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #27ae60; margin-top: 0;">Récapitulatif de votre demande</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Nombre de personnes : ${numberOfPersons}</li>
              <li>Type de chambre : ${roomType}</li>
              ${preferredDate ? `<li>Date préférée : ${preferredDate}</li>` : ''}
              ${totalPrice ? `<li>Prix estimé : ${totalPrice.toLocaleString('fr-FR')} TND</li>` : ''}
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          
          <hr style="margin: 30px 0;"/>
          <p style="color: #e67e22; font-weight: bold;">— L'équipe Batouta Voyages 🌟</p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Demande de réservation envoyée avec succès' });
  } catch (error) {
    console.error('Error sending program reservation request:', error);
    return res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
}
