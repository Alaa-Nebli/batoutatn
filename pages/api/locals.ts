import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

interface NextApiRequestWithFiles extends NextApiRequest {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

// Prevent potential memory leak warning
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer for multiple file fields
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).fields([
  { name: 'program_images', maxCount: 10 },
  { name: 'timeline_images', maxCount: 50 }
]);

// Helper function to remove uploaded files
const removeUploadedFiles = async (files: Express.Multer.File[]) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  }
};

// Fetch all local programs for admin
export const fetchAllLocalPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.localProgram.findMany({
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching local programs:', error);
    res.status(500).json({ message: 'Error fetching local programs', error: (error as Error).message });
  }
};

// Fetch local program by ID
export const fetchLocalProgramById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    
    const program = await prisma.localProgram.findUnique({
      where: { id: id as string },
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!program) {
      return res.status(404).json({ message: 'Local program not found' });
    }

    res.status(200).json(program);
  } catch (error) {
    console.error('Error fetching local program by ID:', error);
    res.status(500).json({ message: 'Error fetching local program by ID', error: (error as Error).message });
  }
};

// Create Local Program
export const createLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const programImages = (req as NextApiRequest & { files: { [fieldname: string]: Express.Multer.File[] } }).files['program_images'] || [];
      const timelineImages = (req as NextApiRequest & { files: { [fieldname: string]: Express.Multer.File[] } }).files['timeline_images'] || [];

      // Log the input data for debugging
      console.log('fromDate:', programData.fromDate);
      console.log('days:', programData.days);

      // Validate fromDate
      const fromDate = new Date(programData.fromDate);
      if (isNaN(fromDate.getTime())) {
        console.error('Invalid fromDate:', programData.fromDate);
        return res.status(400).json({ message: 'Invalid date format for fromDate' });
      }

      // Calculate toDate if it's empty
      let toDate: Date;
      if (!programData.toDate || programData.toDate.trim() === '') {
        // Calculate toDate by adding days to fromDate
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + programData.days);
      } else {
        // Use the provided toDate
        toDate = new Date(programData.toDate);
        if (isNaN(toDate.getTime())) {
          console.error('Invalid toDate:', programData.toDate);
          return res.status(400).json({ message: 'Invalid date format for toDate' });
        }
      }

      // Log the calculated toDate for debugging
      console.log('Calculated toDate:', toDate);

      // Save program images paths
      const imageUrls = programImages.map(file => file.filename);

      // Ensure the dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
      const formattedFromDate = fromDate.toISOString();
      const formattedToDate = toDate.toISOString();

      // Create local program with timeline
      const program = await prisma.localProgram.create({
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: imageUrls,
          location_from: programData.locationFrom,
          location_to: programData.locationTo,
          days: programData.days,
          price: programData.price,
          from_date: formattedFromDate,
          to_date: formattedToDate,
          timeline: {
            create: programData.timeline?.map((item: { title: string; description: string; sortOrder: number; date: string }, index: number) => ({
              title: item.title,
              description: item.description,
              image: timelineImages[index]?.filename || null,
              sortOrder: item.sortOrder,
              date: new Date(item.date)
            })) || []
          }
        },
        include: {
          timeline: true
        }
      });

      res.status(201).json({ 
        message: 'Local program created successfully',
        programId: program.id
      });
    } catch (error) {
      // Clean up uploaded files if database operation fails
      const files = (req as NextApiRequest & { files: { [fieldname: string]: Express.Multer.File[] } }).files;
      if (files) {
        const allFiles = [
          ...(files['program_images'] || []),
          ...(files['timeline_images'] || [])
        ];
        await removeUploadedFiles(allFiles);
      }
      console.error('Error creating local program:', error);
      res.status(500).json({ message: 'Error creating local program', error: (error as Error).message });
    }
  });
};

// Update Local Program
export const updateLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const { id } = req.query;
      const programImages = (req as NextApiRequest & { files: { [fieldname: string]: Express.Multer.File[] } }).files['program_images'] || [];
      const timelineImages = (req as NextApiRequest & { files: { [fieldname: string]: Express.Multer.File[] } }).files['timeline_images'] || [];

      // Save program images paths
      const imageUrls = programImages.map(file => file.filename);

      // Update local program with timeline
      const program = await prisma.localProgram.update({
        where: { id: id as string },
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          location_from: programData.location_from,
          location_to: programData.location_to,
          days: programData.days,
          price: programData.price,
          from_date: new Date(programData.from_date),
          to_date: new Date(programData.to_date),
          timeline: {
            // Delete existing timeline and recreate
            deleteMany: {},
            create: programData.timeline?.map((item: { title: string; description: string; sortOrder: number; date: string }, index: number) => ({
              title: item.title,
              description: item.description,
              image: timelineImages[index]?.filename || null,
              sortOrder: item.sortOrder,
              date: new Date(item.date)
            })) || []
          }
        },
        include: {
          timeline: true
        }
      });

      res.status(200).json({ message: 'Local program updated successfully' });
    } catch (error) {
      const files = (req as NextApiRequestWithFiles).files;
      if (files) {
        const allFiles = [
          ...(files['program_images'] || []),
          ...(files['timeline_images'] || [])
        ];
        await removeUploadedFiles(allFiles);
      }

      console.error('Error updating local program:', error);
      res.status(500).json({ message: 'Error updating local program', error: (error as Error).message });
    }
  });
};

// Delete Local Program
export const deleteLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const program = await prisma.localProgram.findUnique({
      where: { id: id as string },
    });

    if (program) {
      const images = program.images as string[];
      for (const imageUrl of images) {
        const imagePath = path.join(process.cwd(), 'public/uploads', imageUrl);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete image ${imagePath}:`, error);
        }
      }

      await prisma.localProgram.delete({
        where: { id: id as string },
      });
    }

    res.status(200).json({ message: 'Local program deleted successfully' });
  } catch (error) {
    console.error('Error deleting local program:', error);
    res.status(500).json({ message: 'Error deleting local program', error: (error as Error).message });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return createLocalProgram(req, res);
      case 'PUT':
        return updateLocalProgram(req, res);
      case 'DELETE':
        return deleteLocalProgram(req, res);
      case 'GET':
        if (req.query.id) return fetchLocalProgramById(req, res);
        return fetchAllLocalPrograms(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    // Ensure Prisma client is disconnected after each request
    // await prisma.$disconnect();
    console.log("Done")
  }
}