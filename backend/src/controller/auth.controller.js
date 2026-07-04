import usermodel from "../model/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

export async function register(req,res){
try {
   const {name,email,password,role , department,salary , phone , address} = req.body
    const user = await usermodel.findOne({email})
if(user){
    return res.status(400).json({message: "User already exists"})
}
const hash = await bcrypt.hash(password,10)
const newuser = await usermodel.create({name,email,password: hash ,role , department , salary , phone , address})
const token = jwt.sign({id: newuser._id},process.env.JWT_SECRET,{expiresIn: "1d"})

res.cookie('token', token, {
    httpOnly: true,    
    secure: true,     
    sameSite: 'none',  
    maxAge: 24 * 60 * 60 * 1000 
});

res.status(201).json({message: "User created successfully", user: newuser}) 




}
catch(err){
    console.log(err)
    return res.status(500).json({
        message : "internal server error"
    })
}


}






