import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Contact from "@/helpers/models/Contact";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const contactDetails = await Contact.find({});
        res.status(200).json({ success: true, contact: contactDetails });
        break;
      case "POST":
        const contactDetail = await Contact.create(req.body);
        res.status(201).json({ success: true, contact: contactDetail });
        break;
      case "PUT":
        const { _id, ...updatedData } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(
          _id,
          updatedData,
          { new: true }
        );
        if (updatedContact) {
          res.status(200).json({ success: true, contact: updatedContact });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Contact not found" });
        }
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
