import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

// POST bulk create tech tags
export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.tags || !Array.isArray(body.tags)) {
      return NextResponse.json({ error: "Tags array is required" }, { status: 400 });
    }

    if (body.tags.length === 0) {
      return NextResponse.json({ error: "Tags array cannot be empty" }, { status: 400 });
    }

    if (body.tags.length > 50) {
      return NextResponse.json({ error: "Cannot create more than 50 tags at once" }, { status: 400 });
    }

    // Validate each tag
    for (const tag of body.tags) {
      if (!tag || typeof tag !== 'string' || tag.trim().length === 0) {
        return NextResponse.json({ error: "Each tag must be a non-empty string" }, { status: 400 });
      }
    }

    const results = [];
    const errors = [];

    // Process each tag
    for (const tag of body.tags) {
      try {
        const trimmedTag = tag.trim();
        
        // Check if tag already exists (case-insensitive)
        const existingTag = await prisma.techTag.findFirst({
          where: {
            tag: {
              equals: trimmedTag,
              mode: 'insensitive'
            }
          }
        });

        if (existingTag) {
          errors.push({
            tag: trimmedTag,
            error: "Tag already exists"
          });
        } else {
          // Create new tech tag
          const newTechTag = await prisma.techTag.create({
            data: {
              tag: trimmedTag
            }
          });
          
          results.push(newTechTag);
        }
      } catch (error) {
        errors.push({
          tag: tag,
          error: "Failed to create tag"
        });
      }
    }

    return NextResponse.json({
      message: "Bulk operation completed",
      created: results.length,
      failed: errors.length,
      results,
      errors
    }, { 
      status: errors.length === 0 ? 201 : 207 // 207 = Multi-Status
    });
  } catch (error) {
    console.error("Error in bulk tech tag creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE bulk delete tech tags
export async function DELETE(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.tagIds || !Array.isArray(body.tagIds)) {
      return NextResponse.json({ error: "Tag IDs array is required" }, { status: 400 });
    }

    if (body.tagIds.length === 0) {
      return NextResponse.json({ error: "Tag IDs array cannot be empty" }, { status: 400 });
    }

    if (body.tagIds.length > 50) {
      return NextResponse.json({ error: "Cannot delete more than 50 tags at once" }, { status: 400 });
    }

    const results = [];
    const errors = [];

    // Process each tag ID
    for (const tagId of body.tagIds) {
      try {
        // Check if tech tag is being used by any projects
        const projectUsage = await prisma.projectTag.findFirst({
          where: {
            tagId: tagId
          }
        });

        const archiveProjectUsage = await prisma.archiveProjectTag.findFirst({
          where: {
            tagId: tagId
          }
        });

        if (projectUsage || archiveProjectUsage) {
          errors.push({
            tagId: tagId,
            error: "Cannot delete tag. It is currently being used by projects or archive projects."
          });
        } else {
          // Delete tech tag
          await prisma.techTag.delete({
            where: {
              id: tagId
            }
          });
          
          results.push({ tagId, status: "deleted" });
        }
      } catch (error) {
        if (error.code === 'P2025') {
          errors.push({
            tagId: tagId,
            error: "Tag not found"
          });
        } else {
          errors.push({
            tagId: tagId,
            error: "Failed to delete tag"
          });
        }
      }
    }

    return NextResponse.json({
      message: "Bulk deletion completed",
      deleted: results.length,
      failed: errors.length,
      results,
      errors
    }, { 
      status: errors.length === 0 ? 200 : 207 // 207 = Multi-Status
    });
  } catch (error) {
    console.error("Error in bulk tech tag deletion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
