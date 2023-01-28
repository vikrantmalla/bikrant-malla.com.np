import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../helpers/lib/dbConnect'
import Project from '../../../helpers/models/Project'

dbConnect();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const projects = await Project.find({})
                res.status(200).json({ success: true, project: projects })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        case 'POST':
            try {
                const project = await Project.create(req.body)
                res.status(201).json({ success: true, project: project })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}