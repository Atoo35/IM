const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const http = require('http')
const socketio = require('socket.io')
const mongoose = require('mongoose')


const routes = require('./routes')
const PORT = process.env.PORT || 8000
const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"]
    }
})

if (process.env.NODE_ENV != 'production')
    require('dotenv').config()

try {
    mongoose.connect(process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, success) => {
            if (err)
                console.log(err);
            console.log('Connected to Mongo');
        })
} catch (error) {
    console.log(`Error connecting to mongo: ${error}`);
}

const connectedUsers = {}

io.on('connection', function (socket) {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    console.log(connectedUsers);
})


app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers
    return next()
})


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)
server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})