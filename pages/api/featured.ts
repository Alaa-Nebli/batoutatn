import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([{ name: 'banner_image', maxCount: 1 }]);

const uploadToSupabase = async (file: Express.Multer.File, folder: string) => {
  const fileExt = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('programs')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('programs')
    .getPublicUrl(filePath);

  return { publicUrl, path: filePath };
};

const deleteFromSupabase = async (url: string) => {
  try {
    const path = url.split('/').slice(4).join('/');
    const { error } = await supabase.storage.from('programs').remove([path]);
    if (error) console.error('Error deleting file from Supabase:', error);
  } catch (error) {
    console.error('Error extracting path to delete:', error);
  }
};

export const fetchAllFeatured = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const featuredItems = await prisma.featured.findMany({
      include: { trip: true },
      // where: { trip: { display: true } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(featuredItems);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({ message: 'Error fetching featured items', error: (error as Error).message });
  }
};

export const fetchFeaturedById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const featuredItem = await prisma.featured.findUnique({
      where: { id: id as string },
      include: { trip: true }
    });

    if (!featuredItem) return res.status(404).json({ message: 'Featured item not found' });

    res.status(200).json(featuredItem);
  } catch (error) {
    console.error('Error fetching featured item by ID:', error);
    res.status(500).json({ message: 'Error fetching featured item by ID', error: (error as Error).message });
  }
};

export const createFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  upload(req as any, res as any, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading files', error: err.message });

    try {
      const featuredData = JSON.parse(req.body.featuredData);
      const bannerImage = (req as any).files['banner_image']?.[0];

      if (!bannerImage) return res.status(400).json({ message: 'Banner image is required' });

      const tripExists = await prisma.trip.findUnique({ where: { id: featuredData.tripId } });
      if (!tripExists) return res.status(404).json({ message: 'Trip not found' });

      const { publicUrl, path } = await uploadToSupabase(bannerImage, 'banners');

      const featured = await prisma.featured.create({
        data: {
          tripId: featuredData.tripId,
          image: publicUrl,
          cta: featuredData.cta
        }
      });

      res.status(201).json({ message: 'Featured item created successfully', featuredId: featured.id });
    } catch (error) {
      console.error('Error creating featured item:', error);
      res.status(500).json({ message: 'Error creating featured item', error: (error as Error).message });
    }
  });
};

export const updateFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  upload(req as any, res as any, async (err) => {
    if (err) return res.status(500).json({ message: 'Error uploading files', error: err.message });

    try {
      const featuredData = JSON.parse(req.body.featuredData);
      const { id } = req.query;
      const bannerImage = (req as any).files['banner_image']?.[0];

      const existingFeatured = await prisma.featured.findUnique({ where: { id: id as string } });
      if (!existingFeatured) return res.status(404).json({ message: 'Featured item not found' });

      if (featuredData.tripId && featuredData.tripId !== existingFeatured.tripId) {
        const tripExists = await prisma.trip.findUnique({ where: { id: featuredData.tripId } });
        if (!tripExists) return res.status(404).json({ message: 'Trip not found' });
      }

      let imageUrl = existingFeatured.image;
      if (bannerImage) {
        if (imageUrl) await deleteFromSupabase(imageUrl);
        const { publicUrl } = await uploadToSupabase(bannerImage, 'banners');
        imageUrl = publicUrl;
      }

      const updated = await prisma.featured.update({
        where: { id: id as string },
        data: {
          tripId: featuredData.tripId || existingFeatured.tripId,
          image: imageUrl,
          cta: featuredData.cta || existingFeatured.cta
        }
      });

      res.status(200).json({ message: 'Featured item updated successfully', featuredId: updated.id });
    } catch (error) {
      console.error('Error updating featured item:', error);
      res.status(500).json({ message: 'Error updating featured item', error: (error as Error).message });
    }
  });
};

export const deleteFeatured = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const featuredItem = await prisma.featured.findUnique({ where: { id: id as string } });
    if (!featuredItem) return res.status(404).json({ message: 'Featured item not found' });

    if (featuredItem.image) await deleteFromSupabase(featuredItem.image);

    await prisma.featured.delete({ where: { id: id as string } });

    res.status(200).json({ message: 'Featured item deleted successfully' });
  } catch (error) {
    console.error('Error deleting featured item:', error);
    res.status(500).json({ message: 'Error deleting featured item', error: (error as Error).message });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
}
