const dbConnection = require('../database/connection')

module.exports = {
    async index(req, res) {
        const ongId = req.headers.authorization
        const incidents = await dbConnection('incidents')
            .where('ong_id', ongId)
            .select('*')

        return res.json({ status: 'success', data: { incidents } })
    }
}