import dbConnection from '../database/connection'
import { Request, Response } from 'express'

export default {
    async index(req: Request, res: Response): Promise<Response> {
        const ongId = req.headers.authorization
        const incidents = await dbConnection('incidents')
            .where('ong_id', ongId)
            .select('*')

        return res.json({ incidents })
    }
}