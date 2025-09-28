import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPublicRateLimit } from "@/lib/api-utils";
import { createSuccessResponse } from "@/lib/api-errors";

// GET database health status
export const GET = withPublicRateLimit(async (request: NextRequest) => {
  // Simple database health check for MongoDB
  await prisma.$runCommandRaw({ ping: 1 });
  
  const healthData = {
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  };

  return createSuccessResponse(
    healthData,
    "Database health check successful"
  );
});
