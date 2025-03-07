import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
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

// Configure multer for featured banner images
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).fields([
  { name: 'banner_image', maxCount: 1 }
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

// Fetch all featured items
export const fetchAllFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const featuredItems = await prisma.featured.findMany({
      include: {
        trip: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(featuredItems);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({ message: 'Error fetching featured items', error: (error as Error).message });
  }
};

// Fetch featured item by ID
export const fetchFeaturedById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    
    const featuredItem = await prisma.featured.findUnique({
      where: { id: id as string },
      include: {
        trip: true
      }
    });

    if (!featuredItem) {
      return res.status(404).json({ message: 'Featured item not found' });
    }

    res.status(200).json(featuredItem);
  } catch (error) {
    console.error('Error fetching featured item by ID:', error);
    res.status(500).json({ message: 'Error fetching featured item by ID', error: (error as Error).message });
  }
};

// Create featured item
export const createFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore

  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const featuredData = JSON.parse(req.body.featuredData);
      const bannerImage = (req as any).files['banner_image']?.[0];

      if (!bannerImage) {
        return res.status(400).json({ message: 'Banner image is required' });
      }

      // Validate that the trip exists
      const tripExists = await prisma.trip.findUnique({
        where: { id: featuredData.tripId }
      });

      if (!tripExists) {
        // Remove uploaded file if trip doesn't exist
        await removeUploadedFiles([bannerImage]);
        return res.status(404).json({ message: 'Trip not found' });
      }

      // Create featured item
      const featured = await prisma.featured.create({
        data: {
          tripId: featuredData.tripId,
          image: bannerImage.filename,
          cta: featuredData.cta
        }
      });

      res.status(201).json({ 
        message: 'Featured item created successfully',
        featuredId: featured.id
      });
    } catch (error) {
      // Clean up uploaded files if database operation fails
      const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] };
      if (files && files['banner_image']) {
        await removeUploadedFiles(files['banner_image']);
      }
      console.error('Error creating featured item:', error);
      res.status(500).json({ message: 'Error creating featured item', error: (error as Error).message });
    }
  });
};

// Update featured item
export const updateFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const featuredData = JSON.parse(req.body.featuredData);
      const { id } = req.query;
      const bannerImage = (req as any).files['banner_image']?.[0];

      // Validate that the featured item exists
      const existingFeatured = await prisma.featured.findUnique({
        where: { id: id as string }
      });

      if (!existingFeatured) {
        // Remove uploaded file if featured item doesn't exist
        if (bannerImage) {
          await removeUploadedFiles([bannerImage]);
        }
        return res.status(404).json({ message: 'Featured item not found' });
      }

      // Validate that the trip exists if tripId is being updated
      if (featuredData.tripId && featuredData.tripId !== existingFeatured.tripId) {
        const tripExists = await prisma.trip.findUnique({
          where: { id: featuredData.tripId }
        });

        if (!tripExists) {
          // Remove uploaded file if trip doesn't exist
          if (bannerImage) {
            await removeUploadedFiles([bannerImage]);
          }
          return res.status(404).json({ message: 'Trip not found' });
        }
      }

      // Delete old image if a new one is provided
      if (bannerImage && existingFeatured.image) {
        const oldImagePath = path.join(process.cwd(), 'public/uploads', existingFeatured.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.warn(`Could not delete old image ${oldImagePath}:`, error);
        }
      }

      // Update featured item
      const featured = await prisma.featured.update({
        where: { id: id as string },
        data: {
          tripId: featuredData.tripId || existingFeatured.tripId,
          image: bannerImage ? bannerImage.filename : existingFeatured.image,
          cta: featuredData.cta || existingFeatured.cta
        }
      });

      res.status(200).json({ 
        message: 'Featured item updated successfully',
        featuredId: featured.id
      });
    } catch (error) {
      // Clean up uploaded files if database operation fails
      const files = (req as any).files as { [fieldname: string]:Express.Multer.File[] };
      if (files && files['banner_image']) {
        await removeUploadedFiles(files['banner_image']);
      }
      console.error('Error updating featured item:', error);
      res.status(500).json({ message: 'Error updating featured item', error: (error as Error).message });
    }
  });
};

// Delete featured item
export const deleteFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const featuredItem = await prisma.featured.findUnique({
      where: { id: id as string }
    });

    if (featuredItem) {
      // Delete the banner image
      if (featuredItem.image) {
        const imagePath = path.join(process.cwd(), 'public/uploads', featuredItem.image);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete image ${imagePath}:`, error);
        }
      }

      // Delete the featured item from the database
      await prisma.featured.delete({
        where: { id: id as string }
      });
    } else {
      return res.status(404).json({ message: 'Featured item not found' });
    }

    res.status(200).json({ message: 'Featured item deleted successfully' });
  } catch (error) {
    console.error('Error deleting featured item:', error);
    res.status(500).json({ message: 'Error deleting featured item', error: (error as Error).message });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return createFeatured(req, res);
      case 'PUT':
        return updateFeatured(req, res);
      case 'DELETE':
        return deleteFeatured(req, res);
      case 'GET':
        if (req.query.id) return fetchFeaturedById(req, res);
        return fetchAllFeatured(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    // Ensure Prisma client is disconnected after each request
    // await prisma.$disconnect();
    console.log("Done");
    
  }
}