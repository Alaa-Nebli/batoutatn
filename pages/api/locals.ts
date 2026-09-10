import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

interface NextApiRequestWithFiles extends NextApiRequest {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

interface ActivityPayload {
  time?: string;
  title: string;
  description?: string;
  type?: string;
  location?: string;
  order?: number;
}

interface DayPayload {
  dayNumber?: number;
  title: string;
  route?: string;
  summary?: string;
  highlight?: string;
  hotel?: string;
  meals?: string[];
  tags?: string[];
  order?: number;
  activities?: ActivityPayload[];
}

interface LocalProgramPayload {
  title: string;
  slug?: string;
  type?: string;
  status?: string;
  description: string;
  shortDescription?: string;
  highlights?: string[];
  locationFrom?: string;
  locationTo?: string;
  location_from?: string;
  location_to?: string;
  meetingPoint?: string;
  destinations?: string[];
  days: number | string;
  nights?: number | string;
  price: number | string;
  priceLabel?: string;
  currency?: string;
  durationLabel?: string;
  fromDate?: string;
  toDate?: string;
  from_date?: string;
  to_date?: string;
  isDateFlexible?: boolean;
  display?: boolean;
  featured?: boolean;
  sortOrder?: number | string;
  phone?: string;
  whatsappNumber?: string;
  includes?: string[];
  excludes?: string[];
  generalConditions?: string[];
  paymentConditions?: string[];
  cancellationTerms?: string[];
  mapEmbedUrl?: string;
  videoUrl?: string;
  hotels?: { name: string; stars?: number; website?: string }[];
  singleAddonPrice?: number | string;
  childPrice?: number | string;
  daysDetails?: DayPayload[];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([{ name: 'program_images', maxCount: 20 }]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);

const ensureUniqueSlug = async (baseSlug: string, excludeId?: string) => {
  let candidate = baseSlug || `local-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existing = await prisma.localProgram.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
};

const toArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) return null;
  const arr = value
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
  return arr.length > 0 ? arr : null;
};

const jsonOrNull = (value: string[] | null) => value ?? Prisma.JsonNull;

const normalizeProgramType = (value?: string) => {
  const allowed = new Set([
    'DAY_TRIP',
    'EVENING',
    'WEEKEND',
    'MULTI_DAY_CIRCUIT',
    'EXCURSION',
    'EVENT',
    'CUSTOM',
  ]);
  const candidate = String(value || 'MULTI_DAY_CIRCUIT').trim().toUpperCase();
  return allowed.has(candidate) ? candidate : 'MULTI_DAY_CIRCUIT';
};

const normalizeProgramStatus = (value?: string, display = true) => {
  const allowed = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
  const candidate = String(value || (display ? 'PUBLISHED' : 'DRAFT')).trim().toUpperCase();
  return allowed.has(candidate) ? candidate : 'DRAFT';
};

const normalizeProgramData = (payload: LocalProgramPayload) => {
  const locationFrom = payload.locationFrom || payload.location_from || '';
  const locationTo = payload.locationTo || payload.location_to || '';
  const fromDateRaw = payload.fromDate || payload.from_date;
  const toDateRaw = payload.toDate || payload.to_date;

  const days = Number(payload.days);
  const nights = Number(payload.nights ?? Math.max(days - 1, 0));
  const price = Number(payload.price);
  const singleAddonPrice = payload.singleAddonPrice !== undefined && payload.singleAddonPrice !== null && payload.singleAddonPrice !== ''
    ? Number(payload.singleAddonPrice)
    : null;

  const daysDetails = Array.isArray(payload.daysDetails)
    ? payload.daysDetails
        .filter((day) => day && day.title)
        .map((day, index) => ({
          dayNumber: Number(day.dayNumber || index + 1),
          title: String(day.title || `Jour ${index + 1}`),
          route: String(day.route || ''),
          summary: day.summary ? String(day.summary) : null,
          highlight: day.highlight ? String(day.highlight) : null,
          hotel: day.hotel ? String(day.hotel) : null,
          meals: toArray(day.meals),
          tags: toArray(day.tags),
          order: Number(day.order || index + 1),
          activities: Array.isArray(day.activities)
            ? day.activities
                .filter((activity) => activity && activity.title)
                .map((activity, activityIndex) => ({
                  time: activity.time ? String(activity.time) : null,
                  title: String(activity.title),
                  description: activity.description ? String(activity.description) : null,
                  type: activity.type ? String(activity.type) : null,
                  location: activity.location ? String(activity.location) : null,
                  order: Number(activity.order || activityIndex + 1),
                }))
            : [],
        }))
    : [];

  return {
    title: String(payload.title || '').trim(),
    slug: payload.slug ? slugify(payload.slug) : slugify(payload.title || ''),
    type: normalizeProgramType(payload.type),
    status: normalizeProgramStatus(payload.status, payload.display ?? true),
    description: String(payload.description || '').trim(),
    shortDescription: payload.shortDescription ? String(payload.shortDescription).trim() : null,
    highlights: toArray(payload.highlights),
    locationFrom: String(locationFrom).trim(),
    locationTo: String(locationTo).trim(),
    meetingPoint: payload.meetingPoint ? String(payload.meetingPoint).trim() : null,
    destinations: toArray(payload.destinations),
    days,
    nights,
    price,
    priceLabel: payload.priceLabel ? String(payload.priceLabel).trim() : null,
    currency: String(payload.currency || 'TND').trim() || 'TND',
    durationLabel: payload.durationLabel ? String(payload.durationLabel).trim() : null,
    fromDateRaw,
    toDateRaw,
    isDateFlexible: Boolean(payload.isDateFlexible),
    display: payload.display ?? true,
    featured: Boolean(payload.featured),
    sortOrder: Number(payload.sortOrder || 0),
    phone: payload.phone ? String(payload.phone).trim() : null,
    whatsappNumber: payload.whatsappNumber ? String(payload.whatsappNumber).trim() : null,
    includes: toArray(payload.includes),
    excludes: toArray(payload.excludes),
    generalConditions: toArray(payload.generalConditions),
    paymentConditions: toArray(payload.paymentConditions),
    cancellationTerms: toArray(payload.cancellationTerms),
    mapEmbedUrl: payload.mapEmbedUrl ? String(payload.mapEmbedUrl).trim() : null,
    videoUrl: payload.videoUrl ? String(payload.videoUrl).trim() : null,
    hotels: Array.isArray(payload.hotels)
      ? payload.hotels
          .filter((h) => h && h.name)
          .map((h) => ({
            name: String(h.name || '').trim(),
            stars: h.stars !== undefined && h.stars !== null ? Number(h.stars) : null,
            website: h.website ? String(h.website).trim() : null,
          }))
      : null,
    singleAddonPrice,
    childPrice: payload.childPrice !== undefined && payload.childPrice !== null && payload.childPrice !== ''
      ? Number(payload.childPrice)
      : null,
    daysDetails,
  };
};

const removeUploadedFiles = async (files: Express.Multer.File[]) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch {
      // ignore
    }
  }
};

const buildImagesPayload = (files: Express.Multer.File[]) =>
  files.map((file, index) => ({
    url: `/uploads/${file.filename}`,
    type: index === 0 ? 'cover' : 'gallery',
  }));

const normalizeImageUrls = (images: any): string[] => {
  if (!Array.isArray(images)) return [];
  return images
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry === 'object' && typeof entry.url === 'string') return entry.url;
      return null;
    })
    .filter(Boolean) as string[];
};

export const fetchAllLocalPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.localProgram.findMany({
      include: {
        daysDetails: {
          include: {
            activities: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching local programs:', error);
    res.status(500).json({ message: 'Error fetching local programs', error: (error as Error).message });
  }
};

export const fetchActiveLocalPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const programs = await prisma.localProgram.findMany({
      where: {
        display: true,
        status: 'PUBLISHED',
      },
      include: {
        daysDetails: {
          include: {
            activities: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching active local programs:', error);
    res.status(500).json({ message: 'Error fetching active local programs', error: (error as Error).message });
  }
};

export const fetchLocalProgramById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const program = await prisma.localProgram.findFirst({
      where: {
        OR: [{ id: id as string }, { slug: id as string }],
      },
      include: {
        daysDetails: {
          include: {
            activities: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
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

export const createLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const programData = JSON.parse(req.body.programData || '{}') as LocalProgramPayload;
      const files = (req as NextApiRequestWithFiles).files || {};
      const programImages = files.program_images || [];
      const normalized = normalizeProgramData(programData);

      if (!normalized.title || !normalized.description || !normalized.locationFrom || !normalized.locationTo) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!normalized.fromDateRaw || Number.isNaN(normalized.days) || normalized.days <= 0 || Number.isNaN(normalized.price)) {
        return res.status(400).json({ message: 'Invalid date/days/price values' });
      }

      const fromDate = new Date(normalized.fromDateRaw as string);
      if (Number.isNaN(fromDate.getTime())) {
        return res.status(400).json({ message: 'Invalid from_date' });
      }

      let toDate: Date;
      if (!normalized.toDateRaw) {
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + normalized.days - 1);
      } else {
        toDate = new Date(normalized.toDateRaw as string);
        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({ message: 'Invalid to_date' });
        }
      }

      const uniqueSlug = await ensureUniqueSlug(normalized.slug);
      const imagesPayload = buildImagesPayload(programImages);

      const created = await prisma.localProgram.create({
        data: {
          title: normalized.title,
          slug: uniqueSlug,
          type: normalized.type,
          status: normalized.status,
          description: normalized.description,
          shortDescription: normalized.shortDescription,
          highlights: jsonOrNull(normalized.highlights),
          images: imagesPayload,
          videoUrl: normalized.videoUrl,
          location_from: normalized.locationFrom,
          location_to: normalized.locationTo,
          meetingPoint: normalized.meetingPoint,
          destinations: jsonOrNull(normalized.destinations),
          days: normalized.days,
          nights: Number.isNaN(normalized.nights) ? Math.max(normalized.days - 1, 0) : normalized.nights,
          price: normalized.price,
          priceLabel: normalized.priceLabel,
          currency: normalized.currency,
          durationLabel: normalized.durationLabel,
          from_date: fromDate,
          to_date: toDate,
          isDateFlexible: normalized.isDateFlexible,
          display: normalized.display,
          featured: normalized.featured,
          sortOrder: Number.isNaN(normalized.sortOrder) ? 0 : normalized.sortOrder,
          phone: normalized.phone,
          whatsappNumber: normalized.whatsappNumber,
          includes: jsonOrNull(normalized.includes),
          excludes: jsonOrNull(normalized.excludes),
          generalConditions: jsonOrNull(normalized.generalConditions),
          paymentConditions: jsonOrNull(normalized.paymentConditions),
          cancellationTerms: jsonOrNull(normalized.cancellationTerms),
          mapEmbedUrl: normalized.mapEmbedUrl,
          hotels: normalized.hotels ? (normalized.hotels as Prisma.InputJsonValue) : Prisma.JsonNull,
          singleAddonPrice: Number.isNaN(Number(normalized.singleAddonPrice)) ? null : normalized.singleAddonPrice,
          childPrice: Number.isNaN(Number(normalized.childPrice)) ? null : normalized.childPrice,
          daysDetails: {
            create: normalized.daysDetails.map((day) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              route: day.route,
              summary: day.summary,
              highlight: day.highlight,
              hotel: day.hotel,
              meals: jsonOrNull(day.meals),
              tags: jsonOrNull(day.tags),
              order: day.order,
              activities: {
                create: day.activities.map((activity) => ({
                  time: activity.time,
                  title: activity.title,
                  description: activity.description,
                  type: activity.type,
                  location: activity.location,
                  order: activity.order,
                })),
              },
            })),
          },
        },
      });

      res.status(201).json({ message: 'Local program created successfully', programId: created.id });
    } catch (error) {
      const files = (req as NextApiRequestWithFiles).files;
      if (files?.program_images) {
        await removeUploadedFiles(files.program_images);
      }
      console.error('Error creating local program:', error);
      res.status(500).json({ message: 'Error creating local program', error: (error as Error).message });
    }
  });
};

export const updateLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: (err as Error).message });
    }

    try {
      const { id } = req.query;
      const programData = JSON.parse(req.body.programData || '{}') as LocalProgramPayload;
      const files = (req as NextApiRequestWithFiles).files || {};
      const programImages = files.program_images || [];
      const normalized = normalizeProgramData(programData);

      const existing = await prisma.localProgram.findFirst({
        where: { OR: [{ id: id as string }, { slug: id as string }] },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Local program not found' });
      }

      if (!normalized.title || !normalized.description || !normalized.locationFrom || !normalized.locationTo) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const fromDate = new Date((normalized.fromDateRaw || existing.from_date) as string);
      const toDate = new Date((normalized.toDateRaw || existing.to_date) as string);

      if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date values' });
      }

      const uniqueSlug = await ensureUniqueSlug(normalized.slug || existing.slug, existing.id);
      const incomingImages = buildImagesPayload(programImages);
      const finalImages = (
        incomingImages.length > 0
          ? incomingImages
          : Array.isArray(existing.images)
            ? existing.images
            : []
      ) as Prisma.InputJsonValue;

      const updated = await prisma.localProgram.update({
        where: { id: existing.id },
        data: {
          title: normalized.title,
          slug: uniqueSlug,
          type: normalized.type,
          status: normalized.status,
          description: normalized.description,
          shortDescription: normalized.shortDescription,
          highlights: jsonOrNull(normalized.highlights),
          images: finalImages,
          videoUrl: normalized.videoUrl,
          location_from: normalized.locationFrom,
          location_to: normalized.locationTo,
          meetingPoint: normalized.meetingPoint,
          destinations: jsonOrNull(normalized.destinations),
          days: normalized.days,
          nights: Number.isNaN(normalized.nights) ? Math.max(normalized.days - 1, 0) : normalized.nights,
          price: normalized.price,
          priceLabel: normalized.priceLabel,
          currency: normalized.currency,
          durationLabel: normalized.durationLabel,
          from_date: fromDate,
          to_date: toDate,
          isDateFlexible: normalized.isDateFlexible,
          display: normalized.display,
          featured: normalized.featured,
          sortOrder: Number.isNaN(normalized.sortOrder) ? 0 : normalized.sortOrder,
          phone: normalized.phone,
          whatsappNumber: normalized.whatsappNumber,
          includes: jsonOrNull(normalized.includes),
          excludes: jsonOrNull(normalized.excludes),
          generalConditions: jsonOrNull(normalized.generalConditions),
          paymentConditions: jsonOrNull(normalized.paymentConditions),
          cancellationTerms: jsonOrNull(normalized.cancellationTerms),
          mapEmbedUrl: normalized.mapEmbedUrl,
          hotels: normalized.hotels ? (normalized.hotels as Prisma.InputJsonValue) : Prisma.JsonNull,
          singleAddonPrice: Number.isNaN(Number(normalized.singleAddonPrice)) ? null : normalized.singleAddonPrice,
          childPrice: Number.isNaN(Number(normalized.childPrice)) ? null : normalized.childPrice,
          daysDetails: {
            deleteMany: {},
            create: normalized.daysDetails.map((day) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              route: day.route,
              summary: day.summary,
              highlight: day.highlight,
              hotel: day.hotel,
              meals: jsonOrNull(day.meals),
              tags: jsonOrNull(day.tags),
              order: day.order,
              activities: {
                create: day.activities.map((activity) => ({
                  time: activity.time,
                  title: activity.title,
                  description: activity.description,
                  type: activity.type,
                  location: activity.location,
                  order: activity.order,
                })),
              },
            })),
          },
        },
      });

      res.status(200).json({ message: 'Local program updated successfully', programId: updated.id });
    } catch (error) {
      const files = (req as NextApiRequestWithFiles).files;
      if (files?.program_images) {
        await removeUploadedFiles(files.program_images);
      }
      console.error('Error updating local program:', error);
      res.status(500).json({ message: 'Error updating local program', error: (error as Error).message });
    }
  });
};

export const deleteLocalProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const existing = await prisma.localProgram.findFirst({
      where: { OR: [{ id: id as string }, { slug: id as string }] },
      select: { id: true, images: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Local program not found' });
    }

    const imageUrls = normalizeImageUrls(existing.images);
    for (const imageUrl of imageUrls) {
      if (!imageUrl.startsWith('/uploads/')) continue;
      const imagePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
      try {
        await fs.unlink(imagePath);
      } catch {
        // ignore
      }
    }

    await prisma.localProgram.delete({ where: { id: existing.id } });
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
        if (req.query.active === 'true') return fetchActiveLocalPrograms(req, res);
        return fetchAllLocalPrograms(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    console.log('Done');
  }
}
