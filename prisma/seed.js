const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

// Initialize PrismaClient
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // First clear existing data (but preserve Users)
  await prisma.prospect.deleteMany({});
  await prisma.musician.deleteMany({});

  console.log("Cleared existing musician and prospect data");

  // Get count of existing musicians
  const existingCount = await prisma.musician.count();
  console.log(`Found ${existingCount} existing musicians`);

  // Create musicians
  const musicians = [];
  for (let i = 0; i < 1000; i++) {
    const musician = {
      actName: `The ${faker.word.adjective()} ${faker.word.noun()}`,
      homebase: faker.location.city(),
      active: faker.datatype.boolean(),
      genre: faker.music.genre(),
      averageTicketPrice: faker.number.float({
        min: 10,
        max: 200,
        precision: 2,
      }),
      averageVenueCapacity: faker.number.int({ min: 100, max: 5000 }),
      lastThreeVenues: JSON.stringify([
        faker.location.streetAddress(),
        faker.location.streetAddress(),
        faker.location.streetAddress(),
      ]),
      agent: faker.person.fullName(),
      agentEmail: faker.internet.email(),
      agentPhone: faker.phone.number(),
      agency: faker.company.name(),
    };
    musicians.push(musician);
  }

  console.log("Created musician data");

  // Use createMany for better performance
  const createdMusicians = await prisma.musician.createMany({
    data: musicians,
    skipDuplicates: true,
  });

  console.log(`Created ${createdMusicians.count} musicians`);
}

// Execute the seed function
main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
