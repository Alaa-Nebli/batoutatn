import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const reservations = await prisma.programReservation.findMany({
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(reservations);
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      const allowed = new Set(['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED']);
      const nextStatus = String(status || '').toUpperCase();

      if (!id || !allowed.has(nextStatus)) {
        return res.status(400).json({ message: 'Invalid reservation id or status' });
      }

      const updated = await prisma.programReservation.update({
        where: { id },
        data: { status: nextStatus },
      });

      return res.status(200).json(updated);
    }

    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Programme reservation API error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}
