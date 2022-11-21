import dbConnect from '../../../helpers/lib/dbConnect'
import Behance from '../../../helpers/models/Behance'

dbConnect();
export default async function handler(req, res) {

    const { method } = req

    switch (method) {
        case 'GET':
            try {
                const behancehighlights = await Behance.find({})
                res.status(200).json({ success: true, project: behancehighlights })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        case 'POST':
            try {
                const behancehighlight = await Behance.create(req.body)
                res.status(201).json({ success: true, project: behancehighlight })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}