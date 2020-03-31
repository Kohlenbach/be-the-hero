import dbConnection from '../database/connection'
import { Request, Response } from 'express'

export default {
    async create(req: Request, res: Response): Promise<Response> {
        const { id } = req.body
        const ong = await dbConnection('ongs')
            .where('id', id)
            .select('name')
            .first()

        if (!ong) {
            return res.status(400).json({
                status: 'error',
                error: 'No ONG found with this ID' 
            })
        }
        
        return res.json({ ong })
    }
}