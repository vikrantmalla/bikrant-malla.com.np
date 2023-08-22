import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../helpers/lib/dbConnect";
import Project from "../../../helpers/models/Project";

dbConnect();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const projects = await Project.find().sort({ isnew: -1 });
        res.status(200).json({ success: true, project: projects });
        break;
      case "POST":
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, project: project });
        break;
      case "PUT":
        const { _id, ...updatedData } = req.body;
        const updatedProjectData = await Project.findByIdAndUpdate(
          _id,
          updatedData,
          { new: true }
        );
        if (updatedProjectData) {
          res.status(200).json({ success: true, project: updatedProjectData });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Project not found" });
        }
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid method" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
