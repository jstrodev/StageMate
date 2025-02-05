const { PrismaClient, Decimal } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

// Initialize PrismaClient
const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data
    await prisma.prospect.deleteMany(); // Delete prospects first due to foreign key constraints
    await prisma.musician.deleteMany();
    await prisma.user.deleteMany();

    // Create 1000 musicians
    const musicians = await prisma.musician.createMany({
      data: Array(1000)
        .fill(null)
        .map(() => ({
          actName: faker.music.songName(), // or faker.company.name() for more band-like names
          homebase: `${faker.location.city()}, ${faker.location.state()}`,
          active: faker.datatype.boolean(),
          genre: faker.music.genre(),
          averageTicketPrice: new Decimal(
            faker.commerce.price({
              min: 25,
              max: 300,
              dec: 2,
            })
          ),
          averageVenueCapacity: faker.number.int({
            min: 500,
            max: 20000,
          }),
          lastThreeVenues: JSON.stringify([
            {
              venue: faker.company.name() + " Arena",
              location: `${faker.location.city()}, ${faker.location.state({
                abbreviated: true,
              })}`,
            },
            {
              venue: faker.company.name() + " Stadium",
              location: `${faker.location.city()}, ${faker.location.state({
                abbreviated: true,
              })}`,
            },
            {
              venue: faker.company.name() + " Center",
              location: `${faker.location.city()}, ${faker.location.state({
                abbreviated: true,
              })}`,
            },
          ]),
          agent: faker.person.fullName(),
          agentEmail: faker.internet.email(),
          agentPhone: faker.phone.number(),
          agency: faker.company.name() + " Entertainment",
        })),
    });

    console.log("Database has been seeded with musician data. 🌱");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error; // Re-throw the error for better debugging
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
