import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const movie = await prisma.movie.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Inception',
      description: 'A mind-bending thriller',
      durationMin: 148,
    },
  });

  const hall = await prisma.cinemaHall.upsert({
    where: { name: 'Sala 1' },
    update: {},
    create: {
      name: 'Sala 1',
      capacity: 50,
    },
  });

  const startsAt = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.showtime.upsert({
    where: { id: 1 },
    update: {},
    create: {
      movieId: movie.id,
      hallId: hall.id,
      startsAt,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


