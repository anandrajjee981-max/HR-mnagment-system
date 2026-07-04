import { leaveList ,approveLeave ,rejectLeave ,payrollList ,attendanceList } from "../controller/approve.controller.js";
import { verifyme } from "../middleware/verifyme.js";
import express from 'express'
const adminrouter = await express.Router()

adminrouter.get("/leavelist",verifyme,leaveList)
adminrouter.patch("/approve/:id",verifyme,approveLeave)
adminrouter.patch("/reject/:id",verifyme,rejectLeave)
adminrouter.get("/payroll",verifyme,payrollList)
adminrouter.get("/attendlist",verifyme,attendanceList)



export default adminrouter
