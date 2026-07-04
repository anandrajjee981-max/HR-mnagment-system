import express from 'express'
import { verifyme } from '../middleware/verifyme.js'
import { submitleave ,leavelist } from '../controller/leave.controller.js'
const leaverouter = express.Router()
leaverouter.post("/submit",verifyme , submitleave)
leaverouter.get("/get",verifyme ,leavelist)


export default leaverouter