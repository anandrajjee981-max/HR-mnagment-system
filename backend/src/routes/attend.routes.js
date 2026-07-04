import { checkIn , checkOut ,getAttendance} from "../controller/attend.controller.js";
import { verifyme } from '../middleware/verifyme.js'
import express from 'express'
const attendrouter = express.Router()

attendrouter.post("/checkin",verifyme,checkIn)
attendrouter.post("/checkout",verifyme ,checkOut)
attendrouter.get("/getattend",verifyme ,getAttendance)


export default attendrouter
