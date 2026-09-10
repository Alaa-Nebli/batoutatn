/** @type {import('next-sitemap').IConfig} */
const { PrismaClient } = require('@prisma/client');

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.batouta.tn',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api/*'],
  additionalPaths: async (config) => {
    const prisma = new PrismaClient();
    const paths = [];

    try {
      // Dynamic routes: circuits-en-tunisie (Trip model)
      const trips = await prisma.trip.findMany({
        where: { display: true },
        select: { id: true, updatedAt: true },
      });
      for (const trip of trips) {
        paths.push({
          loc: `/circuits-en-tunisie/${trip.id}`,
          lastmod: trip.updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      }

      // Dynamic routes: programmes-en-tunisie (LocalProgram model)
      const programs = await prisma.localProgram.findMany({
        where: { display: true, status: 'PUBLISHED' },
        select: { slug: true, id: true, updatedAt: true },
      });
      for (const prog of programs) {
        const param = prog.slug || prog.id;
        paths.push({
          loc: `/programmes-en-tunisie/${param}`,
          lastmod: prog.updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        });
      }
    } finally {
      await prisma.$disconnect();
    }

    return paths;
  },
};
