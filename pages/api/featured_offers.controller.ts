import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Prevent potential memory leak warning
export const config = {
  api: {
    bodyParser: false,
  },
};

import { File as MulterFile } from 'multer';

interface NextApiRequestWithFile extends NextApiRequest {
  file?: MulterFile;
}

// Reuse the database pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Configure multer for banner images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads/banners'));
  },
  filename: (req, file, cb) => {
    cb(null, `banner-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Initialize featured_offers table
const initializeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS featured_offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255) NOT NULL,
        program_id INT,
        custom_route VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        sort_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
      )
    `);
    
    console.log('Featured offers table initialized successfully');
  } catch (error) {
    console.error('Error initializing featured offers table:', error);
    throw error;
  }
};

// Helper function to remove uploaded file
const removeUploadedFile = async (filePath: string) => {
  try {
    await fs.unlink(path.join(process.cwd(), 'public/uploads/banners', filePath));
  } catch (error) {
    console.error('Error removing file:', error);
  }
};

// Fetch all featured offers for admin
const fetchAllOffers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [offers] = await pool.query(`
      SELECT fo.*, p.title as program_title 
      FROM featured_offers fo
      LEFT JOIN programs p ON fo.program_id = p.id
      ORDER BY fo.sort_order ASC
    `);
    
    res.status(200).json(offers);
  } catch (error) {
    console.error('Error fetching featured offers:', error);
    res.status(500).json({ message: 'Error fetching featured offers', error: (error as Error).message });
  }
};

// Fetch active featured offers for public display
const fetchActiveOffers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [offers] = await pool.query(`
      SELECT fo.*, p.title as program_title 
      FROM featured_offers fo
      LEFT JOIN programs p ON fo.program_id = p.id
      WHERE fo.active = TRUE
      ORDER BY fo.sort_order ASC
    `);
    
    res.status(200).json(offers);
  } catch (error) {
        console.error('Error fetching active offers:', error);
        res.status(500).json({ message: 'Error fetching active offers', error: (error as Error).message });
      }
    };

// Create featured offer
const createOffer = async (req: NextApiRequest, res: NextApiResponse) => {
  upload.single('image')(req as any, res as any, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }

    try {
      const file = (req as NextApiRequestWithFile).file;
      const { title, alt_text, program_id, custom_route, sort_order, active } = req.body;

      const [result] = await pool.query<mysql.ResultSetHeader>(
        `INSERT INTO featured_offers 
         (title, image, alt_text, program_id, custom_route, sort_order, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          file?.filename,
          alt_text,
          program_id || null,
          custom_route || null,
          sort_order,
          active === 'true'
        ]
      );

      res.status(201).json({ 
        message: 'Featured offer created successfully',
        id: result.insertId
      });
    } catch (error) {
      if ((req as NextApiRequestWithFile).file) {
        await removeUploadedFile((req as NextApiRequestWithFile).file!.filename);
      }
      console.error('Error creating featured offer:', error);
      res.status(500).json({ message: 'Error creating featured offer', error: (error as Error).message });
    }
  });
};

// Update featured offer
const updateOffer = async (req: NextApiRequest, res: NextApiResponse) => {
  upload.single('image')(req as any, res as any, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }

    try {
      const { id } = req.query;
      const file = (req as NextApiRequestWithFile).file;
      const { title, alt_text, program_id, custom_route, sort_order, active } = req.body;

      // Get current image if exists
      const [currentOffer] = await pool.query(
        'SELECT image FROM featured_offers WHERE id = ?',
        [id]
      );

      let updateQuery = `
        UPDATE featured_offers 
        SET title = ?, 
            alt_text = ?, 
            program_id = ?, 
            custom_route = ?,
            sort_order = ?,
            active = ?
      `;
      const updateParams = [
        title,
        alt_text,
        program_id || null,
        custom_route || null,
        sort_order,
        active === 'true'
      ];

      // If new image is uploaded, update image field
      if (file) {
        updateQuery += ', image = ?';
        updateParams.push(file.filename);
      }

      updateQuery += ' WHERE id = ?';
      updateParams.push(id);

      await pool.query(updateQuery, updateParams);

      // Remove old image if new one was uploaded
      if (file && currentOffer[0]?.image) {
        await removeUploadedFile(currentOffer[0].image);
      }

      res.status(200).json({ message: 'Featured offer updated successfully' });
    } catch (error) {
      if ((req as NextApiRequestWithFile).file) {
        await removeUploadedFile((req as NextApiRequestWithFile).file!.filename);
      }
      console.error('Error updating featured offer:', error);
      res.status(500).json({ message: 'Error updating featured offer', error: (error as Error).message });
    }
  });
};

// Delete featured offer
const deleteOffer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    // Get current image
    const [offer] = await pool.query(
      'SELECT image FROM featured_offers WHERE id = ?',
      [id]
    );

    // Delete the offer
    await pool.query('DELETE FROM featured_offers WHERE id = ?', [id]);

    // Remove image file
    if (offer[0]?.image) {
      await removeUploadedFile(offer[0].image);
    }

    res.status(200).json({ message: 'Featured offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting featured offer:', error);
    res.status(500).json({ message: 'Error deleting featured offer', error: (error as Error).message });
  }
};

// Main handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await initializeTable();

  switch (req.method) {
    case 'POST':
      return createOffer(req, res);
    case 'PUT':
      return updateOffer(req, res);
    case 'DELETE':
      return deleteOffer(req, res);
    case 'GET':
      return req.query.admin ? fetchAllOffers(req, res) : fetchActiveOffers(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;