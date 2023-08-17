import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Aboutme from "@/helpers/models/Aboutme";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const aboutmeDetails = await Aboutme.find({});
        res
          .status(200)
          .json({ success: true, aboutme: aboutmeDetails });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}