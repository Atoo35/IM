const jwt = require('jsonwebtoken')

module.exports = {
    newMessage(req, res) {
        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                console.log(err.message);
                res.status(403).json({ message: err.message })
            }
            else {
                const { userId } = req.params
                const { message } = req.body
                const messageSocket = req.connectedUsers[userId]       
                if(messageSocket){
                    req.io.sockets.to(messageSocket).emit('new_message',{
                        user_id:authData.user._id,
                        email:authData.user.email,
                        date:Date.now(),
                        message:message                        
                    })
                }

                return res.json({message:"success"})
            }
        })
    }
}