import { PrismaClient } from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../src/lib/password";

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
        aboutDescription1:
          "Passionate developer with expertise in modern web technologies. Building scalable and user-friendly applications that make a difference.",
        aboutDescription2:
          "Specializing in React, Next.js, and full-stack development with a focus on performance and user experience.",
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
          "AWS",
        ],
        ownerEmail: devEmail, // Portfolio owner email
        linkedIn: faker.internet.url(),
        gitHub: faker.internet.url(),
        behance: faker.internet.url(),
        twitter: faker.internet.url(),
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
            images: `https://res.cloudinary.com/dctz4tgkb/image/upload/v1721838410/behance01_kv3lcv.png`,
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
            platform: faker.helpers.arrayElement(["Web", "Design"]),
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

    // Create or update a user with the same email as portfolio owner
    const hashedPassword = await hashPassword("password123"); // Default password for development
    const user = await prisma.user.upsert({
      where: { email: devEmail },
      update: {
        password: hashedPassword, // Update password
        name: portfolioName, // Update name
        isActive: true, // Account is active
        emailVerified: true, // Email is verified for development
      },
      create: {
        email: devEmail, // Same email as portfolio owner
        password: hashedPassword, // Hashed password
        name: portfolioName, // Same name as portfolio
        isActive: true, // Account is active
        emailVerified: true, // Email is verified for development
      },
    });

    console.log("✅ User created:", user.name, "with email:", user.email);
    console.log("🔑 Default password: password123 (for development only)");

    // Create or update user portfolio role - this user is the owner
    await prisma.userPortfolioRole.upsert({
      where: {
        userId_portfolioId: {
          userId: user.id,
          portfolioId: portfolio.id,
        },
      },
      update: {
        role: "OWNER", // This user owns the portfolio
      },
      create: {
        userId: user.id,
        portfolioId: portfolio.id,
        role: "OWNER", // This user owns the portfolio
      },
    });

    console.log("✅ User portfolio role created - user is portfolio owner");

    // Create default config
    const config = await prisma.config.create({
      data: {
        maxWebProjects: 6,
        maxDesignProjects: 6,
        maxTotalProjects: 12,
      },
    });

    console.log("✅ Config created with default limits");

    // Create initial tech options
    const techOptions = [
      // Frontend
      { name: 'React', category: 'Frontend', description: 'JavaScript library for building user interfaces' },
      { name: 'Next.js', category: 'Frontend', description: 'React framework for production' },
      { name: 'Vue.js', category: 'Frontend', description: 'Progressive JavaScript framework' },
      { name: 'TypeScript', category: 'Frontend', description: 'Typed superset of JavaScript' },
      { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS framework' },
      
      // Backend
      { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime for server-side development' },
      { name: 'Express.js', category: 'Backend', description: 'Web application framework for Node.js' },
      { name: 'Python', category: 'Backend', description: 'High-level programming language' },
      { name: 'Django', category: 'Backend', description: 'High-level Python web framework' },
      
      // Database
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
      { name: 'PostgreSQL', category: 'Database', description: 'Advanced open source database' },
      { name: 'Redis', category: 'Database', description: 'In-memory data structure store' },
      
      // DevOps
      { name: 'Docker', category: 'DevOps', description: 'Containerization platform' },
      { name: 'AWS', category: 'DevOps', description: 'Cloud computing platform' },
      { name: 'GitHub Actions', category: 'DevOps', description: 'CI/CD platform' },
      
      // Testing
      { name: 'Jest', category: 'Testing', description: 'JavaScript testing framework' },
      { name: 'Cypress', category: 'Testing', description: 'End-to-end testing framework' },
      
      // Build Tools
      { name: 'Webpack', category: 'Build Tools', description: 'Module bundler' },
      { name: 'Vite', category: 'Build Tools', description: 'Build tool and dev server' },
      { name: 'Sass', category: 'Build Tools', description: 'CSS preprocessor' },
      
      // Other
      { name: 'Git', category: 'Other', description: 'Version control system' },
      { name: 'REST API', category: 'Other', description: 'Architectural style for APIs' },
      { name: 'GraphQL', category: 'Other', description: 'Query language for APIs' }
    ];

    for (const option of techOptions) {
      await prisma.techOption.upsert({
        where: {
          name_category: {
            name: option.name,
            category: option.category,
          },
        },
        update: {
          description: option.description,
          isActive: true,
        },
        create: option,
      });
    }

    console.log("✅ Tech options created:", techOptions.length);

    console.log("🎉 Database seeding completed successfully!");
    console.log("📧 Portfolio owner email:", devEmail);
    console.log("👤 User email:", user.email);
    console.log("🔑 User password: password123 (for development only)");
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
