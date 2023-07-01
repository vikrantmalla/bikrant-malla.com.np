import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Projecthighlight from "../../../helpers/models/ProjectHighlight";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const projecthighlights = await Projecthighlight.find({});
        res
          .status(200)
          .json({ success: true, projectHighlights: projecthighlights });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const projecthighlight = await Projecthighlight.create(req.body);
        res
          .status(201)
          .json({ success: true, projectHighlights: projecthighlight });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
