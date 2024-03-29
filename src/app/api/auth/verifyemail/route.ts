import dbConnect from "@/helpers/lib/dbConnect";
import User from "@/helpers/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/lib/mailer";
import { EmailType } from "@/types/enum";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const {token} = reqBody
    console.log(token);

    const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

    if (!user) {
        return NextResponse.json({error: "Invalid token"}, {status: 400})
    }
    console.log(user);

    user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}