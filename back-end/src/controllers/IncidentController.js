const dbConnection = require('../database/connection')

module.exports = {
    async index(req, res) {
        try {
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
            
            return res.json({ status: 'success', data: { incidents } }) 
        } catch (error) {
            return res.json({ status: 'error', error }) 
        }
    },

    async store(req, res) {
        const { title, description, value } = req.body
        const ongId = req.headers.authorization

        try {
            const [id] = await dbConnection('incidents').insert({
                title, description, value, ong_id: ongId,
            })

            return res.json({ status: 'success', data: { id } })
        } catch (error) {
            return res.json({ status: 'error', error })
        }
    },

    async delete(req, res) {
        const { id } = req.params
        const ongId = req.headers.authorization

        try {
            const incident = await dbConnection('incidents')
                .where('id', id)
                .select('ong_id')
                .first()
    
            if (incident.ong_id !== ongId) {
                return res.status(401).json({ error: 'Operation not permitted' })
            }
    
            await dbConnection('incidents').where('id', id).delete()
            
            return res.json({ status: 'success' })
        } catch (error) {
            return res.json({ status: 'error', error })
        }
    }
}