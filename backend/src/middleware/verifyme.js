import jwt from 'jsonwebtoken'
import usermodel from '../model/user.model.js'


export async function verifyme(req,res,next){
const token = req.cookies.token
if(!token){
    return res.status(404).json({
        message : "token not found"
    })
}
let decoded


try{
decoded = jwt.verify(token , process.env.JWT_SECRET)
const user = await usermodel.findById(decoded.id)
req.user = user 
next()



}
catch(err){

    return res.status(500).json({
        message : "unauthorise acess"
    })
}



}










