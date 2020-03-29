const dbConnection = require('../database/connection')
const crypto = require('crypto')

module.exports = {
    async index(req, res) {
        try {
            const ongs = await dbConnection('ongs').select('*')
         
            return res.json({ status: 'Success', data: { ongs } })
        } catch (error) {
            return res.json({ status: 'Error', error })
        }
    },

    async store(req, res) {
        const { name, email, whatsapp, city, uf } = req.body
        const id = crypto.randomBytes(4).toString('HEX')

        try {
            await dbConnection('ongs').insert({
                id, name, email, whatsapp, city, uf
            })
            
            return res.json({ status: 'Success', data: { id } })
        } catch (error) {
            return res.json({ status: 'Error', error })
        }
    }
}