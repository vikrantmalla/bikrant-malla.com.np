import { Message } from "@/types/enum";
import { z } from "zod";


export const signUpSchema = z.object({
  signupEmail: z.string().nonempty(Message.EMAIL_REQUIRED).email(Message.INVALID_EMAIL),
  signupPassword: z
    .string()
    .nonempty(Message.PASSWORD_REQUIRED)
    .min(4, Message.PASSWORD_MIN_LENGTH),
});

export const signInSchema = z.object({
  loginEmail: z.string().nonempty(Message.EMAIL_REQUIRED).email(Message.INVALID_EMAIL),
  loginPassword: z
    .string()
    .nonempty(Message.PASSWORD_REQUIRED)
});