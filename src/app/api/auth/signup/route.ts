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
    const {email, password} = reqBody

    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({email})

    if(user){
        return NextResponse.json({error: "User already exists"}, {status: 400})
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        email,
        password: hashedPassword
    })

    const savedUser = await newUser.save()

    //send verification email
    await sendEmail({email, emailType: EmailType.VERIFY, userId: savedUser._id})

    return NextResponse.json(
      {
        success: true,
        savedUser,
        message: "User created successfully",
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