const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports = {
    async createUser(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body
            if (await User.findOne({ email }))
                return res.status(400).json({ message: "User already exists" })

            let hashedPassword = await bcrypt.hash(password, 10)
            let userResponse = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            })

            return res.json({ message: 'Successfully created' })
        } catch (error) {
            console.log(error);
            res.json({ message: error })
        }
    },
    getUserByEmail(req, res) {
        jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
            if (err) {
                // console.log(err.message);
                res.status(403).json({ message: err.message })
            }
            else {
                // console.log(authData);
                let { email } = req.params
                try {
                    let userData = await User.findOne({ email }).select('-password')
                    if (userData)
                        if (userData.email === authData.user.email)
                            return res.status(400).json({ message: 'you cannot search yourself' })
                        else
                            return res.json(userData)
                    return res.status(400).json({ message: "User does not exist" })
                } catch (error) {
                    console.log(error.reason);
                    res.json({ message: "Some error occured" })
                }
            }
        })
    }
}