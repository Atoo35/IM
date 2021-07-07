const express = require('express')
const LoginController = require('./controllers/LoginController')
const MessageController = require('./controllers/MessageController')
const UserController = require('./controllers/UserController')
const verifyToken = require('./middleware/verifyToken')
const routes = express.Router()


routes.get('/status', async (req, res) => {
    res.send('Online')
})
//Message
routes.post('/message/:userId',verifyToken,MessageController.newMessage)

//Login
routes.post('/login', LoginController.login)

//User Registration
routes.post('/user/register', UserController.createUser)
routes.get('/user/:email', verifyToken, UserController.getUserByEmail)

// routes
module.exports = routes