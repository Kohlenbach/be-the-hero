const dbConnection = require('../database/connection')

module.exports = {
    async index(req, res) {
        const ongId = req.headers.authorization
        
        try {
            const incidents = await dbConnection('incidents')
                .where('ong_id', ongId)
                .select('*')

            return res.json({ status: 'success', data: { incidents } })
        } catch (error) {
            return res.json({ status: 'error', error })
        }
    }
}