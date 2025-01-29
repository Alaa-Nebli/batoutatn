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

// Database connection configuration
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

// Configure multer for file storage
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
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Flag to track table initialization
let tablesInitialized = false;

// Initialize Tables
const initializeTables = async () => {
  if (tablesInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        images JSON,
        location_from VARCHAR(255) NOT NULL,
        location_to VARCHAR(255) NOT NULL,
        days INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        display BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS program_timeline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        sort_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (package_id) REFERENCES programs(id) ON DELETE CASCADE
      )
    `);

    tablesInitialized = true;
    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
};

// Helper function to remove uploaded files
const removeUploadedFiles = async (files: any) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  }
};

// Fetch all programs for admin
export const fetchAllPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Fetching all programs');
    
    const [programs] = await pool.query(`
      SELECT p.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', pt.id, 
                 'title', pt.title, 
                 'description', pt.description, 
                 'image', pt.image, 
                 'sort_order', pt.sort_order
               )
             ) as timeline
      FROM programs p
      LEFT JOIN program_timeline pt ON p.id = pt.package_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs', error: (error as Error).message });
  }
};

// Fetch displayed programs
export const fetchDisplayedPrograms = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [programs] = await pool.query(`
      SELECT p.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', pt.id, 
                 'title', pt.title, 
                 'description', pt.description, 
                 'image', pt.image, 
                 'sort_order', pt.sort_order
               )
             ) as timeline
      FROM programs p
      LEFT JOIN program_timeline pt ON p.id = pt.package_id
      WHERE p.display = TRUE
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

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
    const [programs] = await pool.query(`
      SELECT p.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', pt.id, 
                 'title', pt.title, 
                 'description', pt.description, 
                 'image', pt.image, 
                 'sort_order', pt.sort_order
               )
             ) as timeline
      FROM programs p
      LEFT JOIN program_timeline pt ON p.id = pt.package_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    res.status(200).json(programs[0]);
  } catch (error) {
    console.error('Error fetching program by ID:', error);
    res.status(500).json({ message: 'Error fetching program by ID', error: (error as Error).message });
  }
};

// Create Program
export const createProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  upload.array('images', 10)(req as any, res as any, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      // Create program logic here
    } catch (error) {
      const files = (req as any).files;
      if (files) await removeUploadedFiles(files);

      console.error('Error creating program:', error);
      res.status(500).json({ message: 'Error creating program', error: (error as Error).message });
    }
  });
};

// Update Program
export const updateProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  upload.array('images', 10)(req as any, res as any, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      // Update program logic here
    } catch (error) {
      const files = (req as any).files ;
      if (files) await removeUploadedFiles(files);

      console.error('Error updating program:', error);
      res.status(500).json({ message: 'Error updating program', error: (error as Error).message });
    }
  });
};

// Delete Program
export const deleteProgram = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const [program] = await pool.query('SELECT images FROM programs WHERE id = ?', [id]);
    const images = program[0] ? JSON.parse(program[0].images || '[]') : [];

    for (const imageUrl of images) {
      const imagePath = path.join(process.cwd(), 'public/uploads', imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.warn(`Could not delete image ${imagePath}:`, error);
      }
    }

    await pool.query('DELETE FROM programs WHERE id = ?', [id]);

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program', error: (error as Error).message });
  }
};

// Main handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeTables();
  console.log('Request method:', req.method);
  
  switch (req.method) {
    case 'POST':
      return createProgram(req, res);
    case 'PUT':
      return updateProgram(req, res);
    case 'DELETE':
      return deleteProgram(req, res);
    case 'GET':
      // Distinguish between admin and public routes based on a query parameter or authentication
      return req.query.admin ? fetchAllPrograms(req, res) : req.query.id ? fetchProgramById(req, res):  fetchDisplayedPrograms(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
