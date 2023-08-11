import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import MetaTag from "@/helpers/models/MetaTag";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const metatags = await MetaTag.find({});
        res
          .status(200)
          .json({ success: true, metaTag: metatags });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
