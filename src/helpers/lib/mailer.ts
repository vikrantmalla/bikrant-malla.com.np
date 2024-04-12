import nodemailer from "nodemailer";
import User from "../models/User";
import bcryptjs from "bcryptjs";
import { EmailType } from "@/types/enum";
import { SendMail } from "@/types/admin";
import { baseUrl } from "./baseUrl";

export const sendEmail = async ({ email, emailType, userId }: SendMail) => {
  console.log(email, emailType, userId);
  try {
    // create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === EmailType.VERIFY) {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === EmailType.RESET) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: process.env.TRANSPORT_HOST,
      port: 2525,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILER,
      to: email,
      subject:
        emailType === EmailType.VERIFY
          ? "Verify your email"
          : "Reset your password",
      html: `<p>Click <a href="${baseUrl}/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === EmailType.VERIFY
          ? "verify your email"
          : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${baseUrl}/verifyemail?token=${hashedToken}
            </p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
