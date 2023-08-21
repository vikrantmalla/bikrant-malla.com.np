import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Aboutme from "@/helpers/models/Aboutme";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const aboutmeDetails = await Aboutme.find({});
        res.status(200).json({ success: true, aboutme: aboutmeDetails });
        break;
      case "POST":
        const aboutmeDetail = await Aboutme.create(req.body);
        res.status(201).json({ success: true, aboutme: aboutmeDetail });
        break;
      case "PUT":
        const { _id, ...updatedData } = req.body;
        const updatedAboutmeData = await Aboutme.findByIdAndUpdate(
          _id,
          updatedData,
          { new: true }
        );
        if (updatedAboutmeData) {
          res.status(200).json({ success: true, aboutme: updatedAboutmeData });
        } else {
          res
            .status(404)
            .json({ success: false, message: "AboutDetail not found" });
        }
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
