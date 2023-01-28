import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../helpers/lib/dbConnect'
import Behance from '../../../helpers/models/Behance'

dbConnect();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const behancehighlights = await Behance.find({})
                res.status(200).json({ success: true, behanceProject: behancehighlights })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        case 'POST':
            try {
                const behancehighlight = await Behance.create(req.body)
                res.status(201).json({ success: true, behanceProject: behancehighlight })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}