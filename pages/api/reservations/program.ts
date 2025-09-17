// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const {
//       tripId,
//       firstName,
//       lastName,
//       email,
//       phone,
//       numberOfPersons,
//       roomType,
//       specialRequests,
//       preferredDate,
//       totalPrice
//     } = req.body;

//     // Validate required fields
//     if (!tripId || !firstName || !lastName || !email || !phone) {
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

//     // Check if trip exists
//     const trip = await prisma.trip.findUnique({
//       where: { id: tripId }
//     });

//     if (!trip) {
//       return res.status(404).json({ 
//         message: 'Programme non trouvé' 
//       });
//     }

//     // Create reservation
//     const reservation = await prisma.programReservation.create({
//       data: {
//         tripId,
//         firstName,
//         lastName,
//         email,
//         phone,
//         numberOfPersons: parseInt(numberOfPersons),
//         roomType: roomType || 'double',
//         specialRequests,
//         preferredDate: preferredDate ? new Date(preferredDate) : null,
//         totalPrice: parseFloat(totalPrice) || null,
//         status: 'PENDING'
//       }
//     });

//     // TODO: Send email notification to admin and user
//     // You can integrate with your email service here

//     res.status(201).json({ 
//       message: 'Réservation créée avec succès',
//       reservationId: reservation.id
//     });

//   } catch (error) {
//     console.error('Program reservation error:', error);
//     res.status(500).json({ 
//       message: 'Erreur serveur lors de la réservation' 
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
