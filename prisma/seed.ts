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
    // Use a consistent email for development
    const devEmail = "vikrantmalla999@gmail.com";
    const portfolioName = "Bikrant Malla";
    const jobTitle = "Full Stack Developer";

    // Create a portfolio with consistent data
    const portfolio = await prisma.portfolio.create({
      data: {
        name: portfolioName,
        jobTitle: jobTitle,
        aboutDescription1: "Passionate developer with expertise in modern web technologies. Building scalable and user-friendly applications that make a difference.",
        aboutDescription2: "Specializing in React, Next.js, and full-stack development with a focus on performance and user experience.",
        skills: [
          "React",
          "Next.js", 
          "Node.js",
          "TypeScript",
          "MongoDB",
          "PostgreSQL",
          "Tailwind CSS",
          "GraphQL",
          "Docker",
          "AWS"
        ],
        email: devEmail,
        ownerEmail: devEmail, // Same email as owner
        linkedIn: "https://linkedin.com/in/bikrantmalla",
        gitHub: "https://github.com/bikrantmalla",
        facebook: "https://facebook.com/bikrantmalla",
        instagram: "https://instagram.com/bikrantmalla",
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
      prisma.techTag.create({ data: { tag: "PostgreSQL" } }),
      prisma.techTag.create({ data: { tag: "Tailwind CSS" } }),
      prisma.techTag.create({ data: { tag: "GraphQL" } }),
      prisma.techTag.create({ data: { tag: "Docker" } }),
      prisma.techTag.create({ data: { tag: "AWS" } }),
      prisma.techTag.create({ data: { tag: "Python" } }),
      prisma.techTag.create({ data: { tag: "Django" } }),
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
              "Design",
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

    // Create a user with the same email as portfolio owner
    const user = await prisma.user.create({
      data: {
        kindeUserId: `kinde_${Date.now()}`, // Generate a unique ID
        email: devEmail, // Same email as portfolio owner
        name: portfolioName, // Same name as portfolio
      },
    });

    console.log("✅ User created:", user.name, "with email:", user.email);

    // Create user portfolio role - this user is the owner
    await prisma.userPortfolioRole.create({
      data: {
        userId: user.id,
        portfolioId: portfolio.id,
        role: "owner", // This user owns the portfolio
      },
    });

    console.log("✅ User portfolio role created - user is portfolio owner");

    console.log("✅ Config created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("📧 Portfolio owner email:", devEmail);
    console.log("👤 User email:", user.email);
    console.log("🔗 Portfolio ID:", portfolio.id);
    console.log("🔗 User ID:", user.id);
    
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
