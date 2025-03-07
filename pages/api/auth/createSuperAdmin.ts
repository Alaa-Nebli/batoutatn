// import { PrismaClient } from '@prisma/client';
// import { hashPassword } from '../../../utils/pwd_hash.js';

// const prisma = new PrismaClient();

// async function main() {
//   // Create admin user
//   const hashedPassword = await hashPassword('Admin123');
  
//   const admin = await prisma.user.upsert({
//     where: { username: 'admin' },
//     update: {},
//     create: {
//       username: 'admin',
//       email: 'admin@example.com',
//       password: hashedPassword,
//       name: 'System Administrator',
//       role: 'ADMIN'
//     }
//   });

//   console.log({ admin });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });