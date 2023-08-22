import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import MetaTag from "@/helpers/models/MetaTag";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const metatags = await MetaTag.find({});
        res.status(200).json({ success: true, metaTag: metatags });
        break;
      case "POST":
        const metataginfo = await MetaTag.create(req.body);
        res.status(201).json({ success: true, metatag: metataginfo });
        break;
      case "PUT":
        const { _id, ...updatedData } = req.body;
        const updatedMetaTagData = await MetaTag.findByIdAndUpdate(
          _id,
          updatedData,
          { new: true }
        );
        if (updatedMetaTagData) {
          res.status(200).json({ success: true, metatag: updatedMetaTagData });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Metatag not found" });
        }
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
