import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const event = await req.json();
    console.log("Webhook received:", JSON.stringify(event, null, 2)); // Debug log

    if (event.type === "user.created") {
      const { id, email, first_name } = event.data;
      if (!email || !id) {
        console.error("Missing email or id in webhook data:", event.data);
        return NextResponse.json(
          { error: "Missing email or id" },
          { status: 400 }
        );
      }

      const user = await prisma.user.upsert({
        where: { email },
        update: {
          id, // Ensure ID is updated if email exists
          name: first_name || "Unknown",
          updatedAt: new Date(),
        },
        create: {
          id,
          email,
          name: first_name || "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log("User upserted:", user); // Debug log
      return NextResponse.json(
        { message: "User synced successfully", user },
        { status: 200 }
      );
    }

    console.warn("Unhandled webhook event type:", event.type);
    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
