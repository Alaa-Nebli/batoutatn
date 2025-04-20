// file: pages/api/reserve.js
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
      typeOfTrip,
      fromLocation,
      toLocation,
      departureDate,
      returnDate,
      numberOfPersons,
      name,
      email,
      phone
    } = req.body

    // 2. Build the HTML payload
    const html = `
      <h2>New Reservation Request</h2>
      <p><strong>Type of Trip:</strong> ${typeOfTrip}</p>
      <p><strong>From → To:</strong> ${fromLocation} → ${toLocation}</p>
      <p><strong>Departure Date:</strong> ${departureDate || 'N/A'}</p>
      <p><strong>Return Date:</strong> ${returnDate || 'N/A'}</p>
      <p><strong>Number of Persons:</strong> ${numberOfPersons}</p>
      <hr/>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
    `;

    // 3. Send to your back‑office
    await resend.emails.send({
      from:    process.env.RESEND_FROM,  
      to:      [process.env.RESEND_TO],   
      subject: `✈️ Nouvelle réservation – ${name}`,
      html,
    });

    // 4. (Optional) Acknowledge to the user
    await resend.emails.send({
      from:    process.env.RESEND_FROM,
      to:      [email],
      subject: 'Votre demande de réservation a bien été reçue ✅',
      text:    `Bonjour ${name},\n\nNous avons bien reçu votre demande. Nous reviendrons vers vous très bientôt.\n\n— L’équipe Batouta Voyages`
    });

    return res.status(200).json({ message: 'Reservation request sent successfully' });
  } catch (error) {
    console.error('Error sending reservation request:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
