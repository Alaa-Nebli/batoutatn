// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const {
//       typeOfTrip,
//       fromLocation,
//       toLocation,
//       departureDate,
//       returnDate,
//       numberOfPersons,
//       firstName,
//       lastName,
//       email,
//       phone,
//       classType
//     } = req.body;

//     // Validate required fields
//     if (!fromLocation || !toLocation || !departureDate || !firstName || !lastName || !email || !phone) {
//       return res.status(400).json({ 
//         message: 'Les champs obligatoires sont manquants' 
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ 
//         message: 'Format d\'email invalide' 
//       });
//     }

//     // Validate dates
//     const depDate = new Date(departureDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     if (depDate < today) {
//       return res.status(400).json({ 
//         message: 'La date de départ ne peut pas être dans le passé' 
//       });
//     }

//     if (typeOfTrip === 'round-trip' && returnDate) {
//       const retDate = new Date(returnDate);
//       if (retDate <= depDate) {
//         return res.status(400).json({ 
//           message: 'La date de retour doit être après la date de départ' 
//         });
//       }
//     }

//     // Create reservation
//     const reservation = await prisma.ticketingReservation.create({
//       data: {
//         typeOfTrip,
//         fromLocation,
//         toLocation,
//         departureDate: new Date(departureDate),
//         returnDate: returnDate ? new Date(returnDate) : null,
//         numberOfPersons: parseInt(numberOfPersons),
//         firstName,
//         lastName,
//         email,
//         phone,
//         classType: classType || 'economy',
//         status: 'PENDING'
//       }
//     });

//     // TODO: Send email notification to admin and user
//     // You can integrate with your email service here

//     res.status(201).json({ 
//       message: 'Demande de réservation créée avec succès',
//       reservationId: reservation.id
//     });

//   } catch (error) {
//     console.error('Ticketing reservation error:', error);
//     res.status(500).json({ 
//       message: 'Erreur serveur lors de la demande de réservation' 
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
