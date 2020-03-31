import dbConnection from '../database/connection'
import { Request, Response } from 'express'

export default {
    async index(req: Request, res: Response): Promise<Response> {
        const { page = 1 } = req.query
        const [count] = await dbConnection('incidents').count()
        const incidents = await dbConnection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ])

        res.header('X-Total-Count', count['count(*)'])
        
        return res.json({ incidents }) 
    },

    async store(req: Request, res: Response): Promise<Response> {
        const { title, description, value } = req.body
        const ongId = req.headers.authorization
        const [id] = await dbConnection('incidents').insert({
            title, description, value, ong_id: ongId,
        })

        return res.json({ id })
    },

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        const ongId = req.headers.authorization
        const incident = await dbConnection('incidents')
            .where('id', id)
            .select('ong_id')
            .first()

        if (incident.ong_id !== ongId) {
            return res.status(401).json({ error: 'Operation not permitted' })
        }

        await dbConnection('incidents').where('id', id).delete()
        
        return res.json({ status: 'success' })
    }
}