import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Fetch all programs for admin



interface NextApiRequestWithFiles extends NextApiRequest {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer to use memory storage (files will be in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024  }, 
}).fields([
  { name: 'program_images', maxCount: 10 },
  { name: 'timeline_images', maxCount: 50 }
]);

// Upload file to Supabase Storage
const uploadToSupabase = async (file: Express.Multer.File, folder: string) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('programs') // Replace with your bucket name
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('programs')
    .getPublicUrl(filePath);

    console.log(publicUrl)
  return publicUrl;
};


// Delete file from Supabase Storage
const deleteFromSupabase = async (url: string) => {
  try {
    const path = url.split('/').slice(4).join('/'); // Extract path from URL
    const { error } = await supabase.storage
      .from('programs')
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export const createProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const files = (req as NextApiRequestWithFiles).files || {};
      const programImages = files['program_images'] || [];
      const timelineImages = files['timeline_images'] 
            ? Array.isArray(files['timeline_images'])
              ? files['timeline_images'] as Express.Multer.File[] // if array (direct upload)
              : Object.values(files['timeline_images']) as Express.Multer.File[] // if indexed (FormData)
            : [];

      // Upload program images to Supabase
      const programImageUrls = await Promise.all(
        programImages.map(file => uploadToSupabase(file, 'program-images'))
      );

      // Upload timeline images to Supabase
      const timelineImageUrls = await Promise.all(
        timelineImages.map(file => uploadToSupabase(file, 'timeline-images'))
      );

      console.log(timelineImageUrls)

      // Validate fromDate
      const fromDate = new Date(programData.fromDate);
      if (isNaN(fromDate.getTime())) {
        console.error('Invalid fromDate:', programData.fromDate);
        return res.status(400).json({ message: 'Invalid date format for fromDate' });
      }

      // Calculate toDate
      let toDate: Date;
      if (!programData.toDate || programData.toDate.trim() === '') {
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + programData.days);
      } else {
        toDate = new Date(programData.toDate);
        if (isNaN(toDate.getTime())) {
          console.error('Invalid toDate:', programData.toDate);
          return res.status(400).json({ message: 'Invalid date format for toDate' });
        }
      }

      // Create program with timeline
      const program = await prisma.trip.create({
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: programImageUrls,
          location_from: programData.locationFrom,
          location_to: programData.locationTo,
          days: programData.days,
          price: programData.price,
          singleAdon : programData.singleAdon || null,
          from_date: fromDate.toISOString(),
          to_date: toDate.toISOString(),
          display: programData.display,
          timeline: {
            create: programData.timeline?.map((item: any, index: number) => ({
              title: item.title,
              description: item.description,
              image: timelineImageUrls[index] || null,
              sortOrder: item.sortOrder,
              date: new Date(item.date)
            })) || []
          }, 
          priceInclude : programData.priceInclude || null,
          generalConditions : programData.generalConditions || null,

        },
        include: {
          timeline: true
        }
      });

      res.status(201).json({ 
        message: 'Program created successfully',
        programId: program.id
      });
    } catch (error) {
      console.error('Error creating program:', error);
      res.status(500).json({ message: 'Error creating program', error: (error as Error).message });
    }
  });
};

export const updateProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const { id } = req.query;
      const files = (req as NextApiRequestWithFiles).files || {};
      const programImages = files['program_images'] || [];
      const timelineImages = files['timeline_images'] || [];

      // Get existing program to handle image updates
      const existingProgram = await prisma.trip.findUnique({
        where: { id: id as string },
        include: { timeline: true }
      });

      // Upload new program images to Supabase
      const newProgramImageUrls = await Promise.all(
        programImages.map(file => uploadToSupabase(file, 'program-images'))
      );

      // Upload new timeline images to Supabase
      const newTimelineImageUrls = await Promise.all(
        timelineImages.map(file => uploadToSupabase(file, 'timeline-images'))
      );

      // Combine new images with existing ones if not all are being replaced
      const finalProgramImages = newProgramImageUrls.length > 0 
        ? newProgramImageUrls 
        : existingProgram?.images || [];

      // Update program with timeline
      const program = await prisma.trip.update({
        where: { id: id as string },
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: finalProgramImages,
          location_from: programData.location_from,
          location_to: programData.location_to,
          days: programData.days,
          price: programData.price,
          singleAdon : programData.singleAdon || null,
          from_date: new Date(programData.from_date),
          to_date: new Date(programData.to_date),
          display: programData.display,
          timeline: {
            deleteMany: {},
            create: programData.timeline?.map((item: any, index: number) => ({
              title: item.title,
              description: item.description,
              image: newTimelineImageUrls[index] || item.image || null,
              sortOrder: item.sortOrder,
              date: new Date(item.date)
            })) || []
          }, 
          priceInclude : programData.priceInclude || null,
          generalConditions : programData.generalConditions || null,
        },
        include: {
          timeline: true
        }
      });

      // Clean up old images that were replaced
      if (existingProgram) {
        if (newProgramImageUrls.length > 0 && existingProgram.images) {
          // @ts-ignore
          for (const oldImage of existingProgram.images) {
            await deleteFromSupabase(oldImage);
          }
        }
        
        if (newTimelineImageUrls.length > 0) {
          for (const timelineItem of existingProgram.timeline) {
            if (timelineItem.image) {
              await deleteFromSupabase(timelineItem.image);
            }
          }
        }
      }

      res.status(200).json({ 
        message: 'Program updated successfully',
        programId: program.id
      });
    } catch (error) {
      console.error('Error updating program:', error);
      res.status(500).json({ message: 'Error updating program', error: (error as Error).message });
    }
  });
};

export const deleteProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const program = await prisma.trip.findUnique({
      where: { id: id as string },
      include: { timeline: true }
    });

    if (program) {
      // Delete all associated images from Supabase
      if (program.images) {
        for (const imageUrl of (program.images as string[])) {
          await deleteFromSupabase(imageUrl);
        }
      }

      // Delete timeline images
      for (const timelineItem of program.timeline) {
        if (timelineItem.image) {
          await deleteFromSupabase(timelineItem.image);
        }
      }

      // Delete the program record
      await prisma.trip.delete({
        where: { id: id as string },
      });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program', error: (error as Error).message });
  }
};

// Fetch corrections for timeline sorting and creation
export const fetchAllPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.trip.findMany({
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs', error: (error as Error).message });
  }
};



// Fetch program by ID
export const fetchProgramById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    
    const program = await prisma.trip.findUnique({
      where: { id: id as string },
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(program);
  } catch (error) {
    console.error('Error fetching program by ID:', error);
    res.status(500).json({ message: 'Error fetching program by ID', error: (error as Error).message });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return createProgram(req, res);
      case 'PUT':
        return updateProgram(req, res);
      case 'DELETE':
        return deleteProgram(req, res);
      case 'GET':
        if (req.query.id) return fetchProgramById(req, res);
        return fetchAllPrograms(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    console.log("Done");
  }
}