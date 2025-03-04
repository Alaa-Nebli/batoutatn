import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Helper function to create initial admin user
export async function createInitialAdminUser() {
  const prisma = require('@prisma/client').PrismaClient;
  const client = new prisma();

  try {
    // Check if an admin user already exists
    const existingAdmin = await client.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword(
        process.env.INITIAL_ADMIN_PASSWORD || 'admin123'
      );

      await client.user.create({
        data: {
          username: process.env.INITIAL_ADMIN_USERNAME || 'admin',
          email: process.env.INITIAL_ADMIN_EMAIL || 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
          name: 'System Administrator'
        }
      });

      console.log('Initial admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  } finally {
    await client.$disconnect();
  }
}