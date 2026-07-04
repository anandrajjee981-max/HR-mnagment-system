import express from 'express'
const authrouter = express.Router()
import { register } from '../controller/auth.controller.js'
authrouter.post("/register",register)










export default authrouter
