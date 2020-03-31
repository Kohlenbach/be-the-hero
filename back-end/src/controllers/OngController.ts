import dbConnection from '../database/connection'
import crypto from 'crypto'
import { Request, Response } from 'express'

export default {
    async index(req: Request, res: Response): Promise<Response> {
        const ongs = await dbConnection('ongs').select('*')
        
        return res.json({ ongs })
    },

    async store(req: Request, res: Response): Promise<Response> {
        const { name, email, whatsapp, city, uf } = req.body
        const id = crypto.randomBytes(4).toString('HEX')

        await dbConnection('ongs').insert({
            id, name, email, whatsapp, city, uf
        })
        
        return res.json({ id })
    }
}