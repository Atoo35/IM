module.exports = verifyToken = async (req, res, next) => {
    const bearerToken = req.header('user')
    if (typeof bearerToken !== 'undefined') {
        req.token = bearerToken
        next()
    }
    else
        return res.sendStatus(403)
}