const dbConnection = require('../database/connection')

module.exports = {
    async create(req, res) {
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
        
        return res.json({ status: 'success', data: { ong } })
    }
}