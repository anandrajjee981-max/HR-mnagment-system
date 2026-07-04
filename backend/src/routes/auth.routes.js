import express from 'express'
const authrouter = express.Router()
import { register,login ,getme} from '../controller/auth.controller.js'
import { verifyme } from '../middleware/verifyme.js'
authrouter.post("/register",register)
authrouter.post("/login",login)
authrouter.get("/getme",verifyme,getme)








export default authrouter
