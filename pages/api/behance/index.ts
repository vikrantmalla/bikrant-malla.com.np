import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Behance from "../../../helpers/models/Behance";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const behancehighlights = await Behance.find({});
        res
          .status(200)
          .json({ success: true, behanceProject: behancehighlights });
        break;
      case "POST":
        const behancehighlight = await Behance.create(req.body);
        res
          .status(201)
          .json({ success: true, behanceProject: behancehighlight });
        break;
      case "PUT":
        const { _id, ...updatedData } = req.body;
        const updatedBehanceData = await Behance.findByIdAndUpdate(
          _id,
          updatedData,
          { new: true }
        );
        if (updatedBehanceData) {
          res.status(200).json({ success: true, behanceProject: updatedBehanceData });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Behance not found" });
        }
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
