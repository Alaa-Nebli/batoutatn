import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface NextApiRequestWithFiles extends NextApiRequest {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
}).fields([
  { name: 'program_images', maxCount: 10 },
  { name: 'timeline_images', maxCount: 50 },
]);

const uploadToSupabase = async (file: Express.Multer.File, folder: string) => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`File ${file.originalname} exceeds 5MB limit`);
  }

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('programs')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('programs')
    .getPublicUrl(filePath);

  return publicUrl;
};

const deleteFromSupabase = async (url: string) => {
  try {
    const path = url.split('/').slice(4).join('/');
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
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more files exceed the 5MB limit' });
      }
      return res.status(500).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const files = (req as NextApiRequestWithFiles).files || {};
      const programImages = files['program_images'] || [];
      const timelineImages = files['timeline_images'] 
        ? Array.isArray(files['timeline_images'])
          ? files['timeline_images'] as Express.Multer.File[]
          : Object.values(files['timeline_images']) as Express.Multer.File[]
        : [];

      // Validate required fields
      if (!programData.title || !programData.description || !programData.locationFrom || !programData.locationTo) {
        return res.status(400).json({ message: 'Missing required fields: title, description, locationFrom, or locationTo' });
      }

      if (!programData.fromDate || isNaN(new Date(programData.fromDate).getTime())) {
        return res.status(400).json({ message: 'Invalid or missing fromDate' });
      }

      if (isNaN(parseInt(programData.days)) || parseInt(programData.days) <= 0) {
        return res.status(400).json({ message: 'Days must be a positive number' });
      }

      // Validate file types
      const invalidFiles = [...programImages, ...timelineImages].filter(
        file => !file.mimetype.startsWith('image/')
      );
      if (invalidFiles.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid file type(s). Only images are allowed.',
          invalidFiles: invalidFiles.map(f => f.originalname)
        });
      }

      const programImageUrls = await Promise.all(
        programImages.map(file => uploadToSupabase(file, 'program-images'))
      );

      const timelineImageUrls = await Promise.all(
        timelineImages.map(file => uploadToSupabase(file, 'timeline-images'))
      );

      const fromDate = new Date(programData.fromDate);
      let toDate: Date;
      if (!programData.toDate || programData.toDate.trim() === '') {
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + parseInt(programData.days));
      } else {
        toDate = new Date(programData.toDate);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({ message: 'Invalid date format for toDate' });
        }
      }

      const program = await prisma.trip.create({
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: programImageUrls,
          location_from: programData.locationFrom,
          location_to: programData.locationTo,
          days: parseInt(programData.days),
          price: parseFloat(programData.price),
          singleAdon: programData.singleAdon ? parseInt(programData.singleAdon) : 0,
          from_date: fromDate.toISOString(),
          to_date: toDate.toISOString(),
          display: programData.display ?? true, // Default to true if not specified
          timeline: {
            create: programData.timeline?.map((item: any, index: number) => ({
              title: item.title,
              description: item.description,
              image: timelineImageUrls[index] || null,
              sortOrder: index + 1,
              date: new Date(item.date)
            })) || []
          },
          phone: programData.phone || null,
          priceInclude: programData.priceInclude || null,
          generalConditions: programData.generalConditions || null,
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
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more files exceed the 5MB limit' });
      }
      return res.status(500).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload error', error: err.message });
    }

    try {
      const programData = JSON.parse(req.body.programData);
      const keptImages: string[] = req.body.keptImages
        ? JSON.parse(req.body.keptImages)
        : [];
      const { id } = req.query;
      const files = (req as NextApiRequestWithFiles).files || {};

      // Validate required fields
      if (!programData.title || !programData.description || !programData.location_from || !programData.location_to) {
        return res.status(400).json({ message: 'Missing required fields: title, description, location_from, or location_to' });
      }

      if (!programData.fromDate || isNaN(new Date(programData.fromDate).getTime())) {
        return res.status(400).json({ message: 'Invalid or missing fromDate' });
      }

      if (isNaN(parseInt(programData.days)) || parseInt(programData.days) <= 0) {
        return res.status(400).json({ message: 'Days must be a positive number' });
      }

      // Validate file types
      const galleryFiles: Express.Multer.File[] = (files['program_images'] || []) as Express.Multer.File[];
      const timelineFiles: Record<number, Express.Multer.File> = {};
      for (const [field, fileArr] of Object.entries(files)) {
        if (field.startsWith('timeline_images_')) {
          const idx = Number(field.split('_').pop()!);
          timelineFiles[idx] = (fileArr as Express.Multer.File[])[0];
        }
      }

      const invalidFiles = [...galleryFiles, ...Object.values(timelineFiles)].filter(
        file => !file.mimetype.startsWith('image/')
      );
      if (invalidFiles.length > 0) {
        return res.status(400).json({ 
          message: 'Invalid file type(s). Only images are allowed.',
          invalidFiles: invalidFiles.map(f => f.originalname)
        });
      }

      const fromDate = new Date(programData.fromDate);
      const toDate = new Date(programData.toDate);
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({ message: 'Invalid fromDate/toDate' });
      }

      const existing = await prisma.trip.findUnique({
        where: { id: id as string },
        include: { timeline: true },
      });
      if (!existing) {
        return res.status(404).json({ message: 'Program not found' });
      }

      const newGalleryUrls = await Promise.all(
        galleryFiles.map(f => uploadToSupabase(f, 'program-images')),
      );

      const uploadedTimelineUrls: Record<number, string> = {};
      await Promise.all(
        Object.entries(timelineFiles).map(async ([idx, file]) => {
          uploadedTimelineUrls[Number(idx)] = await uploadToSupabase(file, 'timeline-images');
        }),
      );

      const finalGallery = [...keptImages, ...newGalleryUrls];

      const timelineCreate = programData.timeline.map((item: any, idx: number) => ({
        title: item.title,
        description: item.description,
        image: uploadedTimelineUrls[idx] || item.image || null,
        sortOrder: item.sortOrder,
        date: new Date(item.date),
      }));

      const updated = await prisma.trip.update({
        where: { id: id as string },
        data: {
          title: programData.title,
          metadata: programData.metadata || null,
          description: programData.description,
          images: finalGallery,
          location_from: programData.location_from,
          location_to: programData.location_to,
          days: parseInt(programData.days),
          price: parseFloat(programData.price),
          singleAdon: programData.singleAdon ? parseInt(programData.singleAdon) : undefined,
          from_date: fromDate,
          to_date: toDate,
          display: programData.display ?? existing.display, // Preserve existing display if not provided
          phone: programData.phone || null,
          priceInclude: programData.priceInclude || null,
          generalConditions: programData.generalConditions || null,
          timeline: { deleteMany: {}, create: timelineCreate },
        },
        include: { timeline: true },
      });

      const galleryToPurge = (existing.images as string[]).filter(
        url => !keptImages.includes(url),
      );

      const timelineToPurge = existing.timeline
        .filter(t => t.image && uploadedTimelineUrls[t.sortOrder - 1] !== undefined)
        .map(t => t.image!);

      await Promise.all([
        ...galleryToPurge.map(deleteFromSupabase),
        ...timelineToPurge.map(deleteFromSupabase),
      ]);

      return res.status(200).json({ message: 'Updated', programId: updated.id });
    } catch (e) {
      console.error('Update error:', e);
      return res.status(500).json({ message: 'Update error', error: (e as Error).message });
    }
  });
};

export const deleteProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const program = await prisma.trip.findUnique({
      where: { id: id as string },
      include: { timeline: true },
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    if (program.images) {
      await Promise.all((program.images as string[]).map(deleteFromSupabase));
    }

    for (const timelineItem of program.timeline) {
      if (timelineItem.image) {
        await deleteFromSupabase(timelineItem.image);
      }
    }

    await prisma.trip.delete({
      where: { id: id as string },
    });

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program', error: (error as Error).message });
  }
};

export const fetchAllPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.trip.findMany({
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs', error: (error as Error).message });
  }
};

export const fetchActivePrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.trip.findMany({
      where: { display: true },
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching active programs:', error);
    res.status(500).json({ message: 'Error fetching active programs', error: (error as Error).message });
  }
};

export const fetchProgramById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const program = await prisma.trip.findUnique({
      where: { id: id as string },
      include: {
        timeline: {
          orderBy: { sortOrder: 'asc' },
        },
      },
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
        if (req.query.active === 'true') return fetchActivePrograms(req, res);
        return fetchAllPrograms(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    console.log("Done");
  }
}