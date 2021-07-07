const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    async login(req,res){
        try {
            const {email,password} = req.body;
            if(!(email ||  password)) return res.status(200).json({message:"Please fill all fields"})

            const user = await User.findOne({email})
            if(!user) return res.status(200).json({message:"User not found"})
            
            if(user && await bcrypt.compare(password,user.password)){
                let userResponse = {
                    _id:user._id,
                    email:user.email
                }
                
                return jwt.sign({user:userResponse},process.env.SECRET,(err,token)=>{
                    return res.json({
                        user:token,
                        user_id:user._id
                    })
                })
                // return res.json(userResponse)
            }
            else{
                return res.status(200).json({message:"email and password dont match"})
            }
        } catch (error) {
            throw Error(`Error while Authenticating user: ${error}`)
        }
    }
}