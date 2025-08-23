import { PrismaClient } from "../src/generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Check if we're in production
const isProduction = process.env.NODE_ENV === "production";

async function main() {
  console.log(
    `🌱 Starting database seeding in ${
      isProduction ? "PRODUCTION" : "DEVELOPMENT"
    } mode...`
  );

  if (isProduction) {
    console.log("⚠️  WARNING: Running seed in PRODUCTION mode!");
    console.log("This will create/update production data. Are you sure?");

    // In production, you might want to add additional safety checks
    // For now, we'll proceed but log a warning
  }

  try {
    // Create a portfolio with realistic data
    const portfolio = await prisma.portfolio.create({
      data: {
        name: faker.person.fullName(),
        jobTitle: faker.person.jobTitle(),
        aboutDescription1: faker.lorem.paragraph(2),
        aboutDescription2: faker.lorem.paragraph(1),
        skills: faker.helpers.arrayElements(
          [
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
          ],
          { min: 5, max: 10 }
        ),
        email: faker.internet.email(),
        ownerEmail: faker.internet.email(),
        linkedIn: faker.internet.url({ protocol: "https" }),
        gitHub: faker.internet.url({ protocol: "https" }),
        facebook: faker.internet.url({ protocol: "https" }),
        instagram: faker.internet.url({ protocol: "https" }),
      },
    });

    console.log("✅ Portfolio created:", portfolio.name);

    // Create tech tags with realistic technology names
    const techTags = await Promise.all([
      prisma.techTag.create({ data: { tag: "React" } }),
      prisma.techTag.create({ data: { tag: "Next.js" } }),
      prisma.techTag.create({ data: { tag: "TypeScript" } }),
      prisma.techTag.create({ data: { tag: "Node.js" } }),
      prisma.techTag.create({ data: { tag: "MongoDB" } }),
    ]);

    console.log("✅ Tech tags created:", techTags.length);

    // Create multiple realistic projects
    const projects = await Promise.all(
      Array.from({ length: isProduction ? 3 : 8 }, async (_, index) => {
        const project = await prisma.project.create({
          data: {
            title: faker.company.catchPhrase(),
            subTitle: faker.lorem.sentence(),
            images: `project${String(index + 1).padStart(2, "0")}.jpg`,
            imageUrl: `/images/project${String(index + 1).padStart(
              2,
              "0"
            )}.jpg`,
            alt: faker.lorem.words(3),
            projectView: faker.internet.url({ protocol: "https" }),
            tools: faker.helpers.arrayElements(
              [
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "MongoDB",
                "Tailwind CSS",
                "PostgreSQL",
                "GraphQL",
              ],
              { min: 2, max: 5 }
            ),
            platform: faker.helpers.arrayElement([
              "Web",
              "Mobile",
              "Desktop",
              "API",
            ]),
            portfolioId: portfolio.id,
          },
        });
        return project;
      })
    );

    console.log("✅ Projects created:", projects.length);

    // Create multiple realistic archive projects
    const archiveProjects = await Promise.all(
      Array.from({ length: isProduction ? 2 : 6 }, async (_, index) => {
        const archiveProject = await prisma.archiveProject.create({
          data: {
            title: faker.company.catchPhrase(),
            year: faker.number.int({ min: 2020, max: 2024 }),
            isNew: faker.datatype.boolean(),
            projectView: faker.internet.url({ protocol: "https" }),
            viewCode: faker.internet.url({ protocol: "https" }),
            build: faker.helpers.arrayElements(
              [
                "React",
                "Node.js",
                "TypeScript",
                "MongoDB",
                "PostgreSQL",
                "GraphQL",
                "Docker",
              ],
              { min: 2, max: 4 }
            ),
            portfolioId: portfolio.id,
          },
        });
        return archiveProject;
      })
    );

    console.log("✅ Archive projects created:", archiveProjects.length);

    // Create a user with realistic data
    const user = await prisma.user.create({
      data: {
        kindeUserId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    });

    console.log("✅ User created:", user.name);

    // Create user portfolio role
    await prisma.userPortfolioRole.create({
      data: {
        userId: user.id,
        portfolioId: portfolio.id,
        role: "owner",
      },
    });

    console.log("✅ User portfolio role created");

    // Create config
    await prisma.config.create({
      data: {
        allowBackupImages: faker.datatype.boolean(),
      },
    });

    console.log("✅ Config created");

    console.log("🎉 Database seeding completed successfully!");

    if (isProduction) {
      console.log("⚠️  Remember: This data was created in PRODUCTION mode");
    }
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
