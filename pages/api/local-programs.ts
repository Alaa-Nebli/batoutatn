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
    cb(null, path.join(process.cwd(), 'public/uploads/voyages'));
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
  { name: 'voyage_images', maxCount: 10 },
  { name: 'attraction_images', maxCount: 50 }
]);

// Flag to track table initialization
let tablesInitialized = false;

// Initialize Tables
const initializeTables = async () => {
  if (tablesInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS travel_on_card (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        metadata TEXT,
        description TEXT NOT NULL,
        images JSON,
        country VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        duration VARCHAR(100),
        price_from DECIMAL(10, 2) NOT NULL,
        highlights TEXT,
        includes TEXT,
        excludes TEXT,
        display BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS travel_attractions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        voyage_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        price DECIMAL(10, 2),
        duration VARCHAR(100),
        sort_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (voyage_id) REFERENCES travel_on_card(id) ON DELETE CASCADE
      )
    `);

    tablesInitialized = true;
    console.log('Voyage à la carte tables initialized successfully');
  } catch (error) {
    console.error('Error initializing voyage tables:', error);
    throw error;
  }
};

// Helper function to remove uploaded files
const removeUploadedFiles = async (files) => {
  for (const file of files) {
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  }
};

// Fetch all voyages for admin
export const fetchAllVoyages = async (req, res) => {
  try {
    console.log('Fetching all voyages');
    
    const [voyages]: [any[], any] = await pool.query(`
      SELECT v.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', a.id, 
                 'title', a.title, 
                 'description', a.description, 
                 'image', a.image,
                 'price', a.price,
                 'duration', a.duration,
                 'sort_order', a.sort_order
               )
             ) as attractions
      FROM travel_on_card v
      LEFT JOIN travel_attractions a ON v.id = a.voyage_id
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `);

    res.status(200).json(voyages);
  } catch (error) {
    console.error('Error fetching voyages:', error);
    res.status(500).json({ message: 'Error fetching voyages', error: error.message });
  }
};

// Fetch displayed voyages
export const fetchDisplayedVoyages = async (req, res) => {
  try {
    const [voyages] = await pool.query(`
      SELECT v.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', a.id, 
                 'title', a.title, 
                 'description', a.description, 
                 'image', a.image,
                 'price', a.price,
                 'duration', a.duration,
                 'sort_order', a.sort_order
               )
             ) as attractions
      FROM travel_on_card v
      LEFT JOIN travel_attractions a ON v.id = a.voyage_id
      WHERE v.display = TRUE
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `);

    res.status(200).json(voyages);
  } catch (error) {
    console.error('Error fetching voyages:', error);
    res.status(500).json({ message: 'Error fetching voyages', error: error.message });
  }
};

// Fetch voyage by ID
export const fetchVoyageById = async (req, res) => {
  try {
    const { id } = req.query;
    const [voyages] = await pool.query(`
      SELECT v.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', a.id, 
                 'title', a.title, 
                 'description', a.description, 
                 'image', a.image,
                 'price', a.price,
                 'duration', a.duration,
                 'sort_order', a.sort_order
               )
             ) as attractions
      FROM travel_on_card v
      LEFT JOIN travel_attractions a ON v.id = a.voyage_id
      WHERE v.id = ?
      GROUP BY v.id
    `, [id]);

    if (!Array.isArray(voyages) || voyages.length === 0) {
      return res.status(404).json({ message: 'Voyage not found' });
    }

    res.status(200).json(voyages[0]);
  } catch (error) {
    console.error('Error fetching voyage by ID:', error);
    res.status(500).json({ message: 'Error fetching voyage by ID', error: error.message });
  }
};

// Create Voyage
export const createVoyage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      const voyageData = JSON.parse(req.body.voyageData);
      const voyageImages = req.files['voyage_images'] || [];
      const attractionImages = req.files['attraction_images'] || [];

      // Save voyage images paths
      const imageUrls = voyageImages.map(file => file.filename);

      // Insert voyage data
      const [result] = await pool.query(
        `INSERT INTO travel_on_card (
          title, subtitle, metadata, description, images, country, city,
          duration, price_from, highlights, includes, excludes, display
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          voyageData.title,
          voyageData.subtitle || '',
          voyageData.metadata || '',
          voyageData.description,
          JSON.stringify(imageUrls),
          voyageData.country,
          voyageData.city,
          voyageData.duration || '',
          voyageData.price_from,
          voyageData.highlights || '',
          voyageData.includes || '',
          voyageData.excludes || '',
          voyageData.display || false
        ]
      );

      const voyageId = result[0].insertId;

      // Handle attractions items with images
      if (voyageData.attractions && voyageData.attractions.length > 0) {
        const attractionValues = voyageData.attractions.map((item, index) => [
          voyageId,
          item.title,
          item.description,
          attractionImages[index]?.filename || null,
          item.price || null,
          item.duration || null,
          item.sort_order || index + 1
        ]);

        await pool.query(
          `INSERT INTO travel_attractions 
           (voyage_id, title, description, image, price, duration, sort_order)
           VALUES ?`,
          [attractionValues]
        );
      }

      res.status(201).json({ 
        message: 'Voyage created successfully',
        voyageId: voyageId
      });
    } catch (error) {
      // Clean up uploaded files if database operation fails
      if (req.files) {
        const allFiles = [
          ...(req.files['voyage_images'] || []),
          ...(req.files['attraction_images'] || [])
        ];
        await removeUploadedFiles(allFiles);
      }
      console.error('Error creating voyage:', error);
      res.status(500).json({ message: 'Error creating voyage', error: error.message });
    }
  });
};

// Update Voyage
export const updateVoyage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      const { id } = req.query;
      const voyageData = JSON.parse(req.body.voyageData);
      const voyageImages = req.files['voyage_images'] || [];
      const attractionImages = req.files['attraction_images'] || [];
      
      // Get existing images
      const [existingVoyage] = await pool.query('SELECT images FROM travel_on_card WHERE id = ?', [id]);
      
      if (!existingVoyage.length) {
        return res.status(404).json({ message: 'Voyage not found' });
      }
      
      let existingImages = [];
      try {
        existingImages = JSON.parse(existingVoyage[0].images || '[]');
      } catch (e) {
        console.warn('Error parsing existing images, treating as empty array');
      }
      
      // Handle image updates
      let updatedImages = [...existingImages];
      
      // Add new images
      if (voyageImages.length > 0) {
        const newImageUrls = voyageImages.map(file => file.filename);
        updatedImages = [...updatedImages, ...newImageUrls];
      }
      
      // Remove deleted images if specified
      if (voyageData.removedImages && voyageData.removedImages.length > 0) {
        for (const imageToRemove of voyageData.removedImages) {
          const imagePath = path.join(process.cwd(), 'public/uploads/voyages', imageToRemove);
          try {
            await fs.unlink(imagePath);
            updatedImages = updatedImages.filter(img => img !== imageToRemove);
          } catch (error) {
            console.warn(`Could not delete image ${imagePath}:`, error);
          }
        }
      }
      
      // Update voyage data
      await pool.query(
        `UPDATE travel_on_card SET
          title = ?, 
          subtitle = ?,
          metadata = ?,
          description = ?,
          images = ?,
          country = ?,
          city = ?,
          duration = ?,
          price_from = ?,
          highlights = ?,
          includes = ?,
          excludes = ?,
          display = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          voyageData.title,
          voyageData.subtitle || '',
          voyageData.metadata || '',
          voyageData.description,
          JSON.stringify(updatedImages),
          voyageData.country,
          voyageData.city,
          voyageData.duration || '',
          voyageData.price_from,
          voyageData.highlights || '',
          voyageData.includes || '',
          voyageData.excludes || '',
          voyageData.display || false,
          id
        ]
      );
      
      // Handle attractions (delete and recreate approach for simplicity)
      await pool.query('DELETE FROM travel_attractions WHERE voyage_id = ?', [id]);
      
      if (voyageData.attractions && voyageData.attractions.length > 0) {
        const attractionValues = voyageData.attractions.map((item, index) => {
          // Use new image if provided, otherwise use existing image path
          const imagePath = attractionImages[index]?.filename || item.image || null;
          
          return [
            id,
            item.title,
            item.description,
            imagePath,
            item.price || null,
            item.duration || null,
            item.sort_order || index + 1
          ];
        });

        await pool.query(
          `INSERT INTO travel_attractions 
           (voyage_id, title, description, image, price, duration, sort_order)
           VALUES ?`,
          [attractionValues]
        );
      }

      res.status(200).json({ 
        message: 'Voyage updated successfully',
        voyageId: id
      });
    } catch (error) {
      console.error('Error updating voyage:', error);
      res.status(500).json({ message: 'Error updating voyage', error: error.message });
    }
  });
};

// Delete Voyage
export const deleteVoyage = async (req, res) => {
  try {
    const { id } = req.query;

    // Get the voyage to retrieve image paths
    const [voyage] = await pool.query('SELECT images FROM travel_on_card WHERE id = ?', [id]);
    
    if (!voyage.length) {
      return res.status(404).json({ message: 'Voyage not found' });
    }
    
    // Delete images
    const images = voyage[0] ? JSON.parse(voyage[0].images || '[]') : [];
    for (const imageUrl of images) {
      const imagePath = path.join(process.cwd(), 'public/uploads/voyages', imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.warn(`Could not delete image ${imagePath}:`, error);
      }
    }
    
    // Get attraction images to delete
    const [attractions] = await pool.query('SELECT image FROM travel_attractions WHERE voyage_id = ?', [id]);
    for (const attraction of attractions) {
      if (attraction.image) {
        const imagePath = path.join(process.cwd(), 'public/uploads/voyages', attraction.image);
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete attraction image ${imagePath}:`, error);
        }
      }
    }

    // Delete the voyage (will cascade delete attractions due to foreign key)
    await pool.query('DELETE FROM travel_on_card WHERE id = ?', [id]);

    res.status(200).json({ message: 'Voyage deleted successfully' });
  } catch (error) {
    console.error('Error deleting voyage:', error);
    res.status(500).json({ message: 'Error deleting voyage', error: error.message });
  }
};

// Main handler
export default async function handler(req, res) {
  await initializeTables();
  console.log('Request method:', req.method);
  console.log('Request path:', req.url);
  
  switch (req.method) {
    case 'POST':
      return createVoyage(req, res);
    case 'PUT':
      return updateVoyage(req, res);
    case 'DELETE':
      return deleteVoyage(req, res);
    case 'GET':
      // Distinguish between admin and public routes based on a query parameter
      return req.query.admin 
        ? fetchAllVoyages(req, res) 
        : req.query.id 
          ? fetchVoyageById(req, res)
          : fetchDisplayedVoyages(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}