import dbConnect from '../../../helpers/lib/dbConnect'
import Projecthighlight from '../../../helpers/models/ProjectHighlight'

dbConnect();
export default async function handler(req, res) {

    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const projecthighlights = await Projecthighlight.find({})
                res.status(200).json({ success: true, project: projecthighlights })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        case 'POST':
            try {
                const projecthighlight = await Projecthighlight.create(req.body)
                res.status(201).json({ success: true, project: projecthighlight })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}