// Run with: npx ts-node -O "{\"module\": \"commonjs\"}" pages/api/auth/createSuperAdmin.ts

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../utils/pwd_hash";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword("Batouta@2025");
  
  const admin = await prisma.user.upsert({
    where: { username: "Batouta" },
    update: {
        password: hashedPassword,
        email: "admin@batouta.tn"
    },
    create: {
      username: "Batouta",
      email: "admin@batouta.tn",
      password: hashedPassword,
      name: "System Administrator",
      role: "ADMIN"
    }
  });

  console.log("Admin user status:", admin.username, "is ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });