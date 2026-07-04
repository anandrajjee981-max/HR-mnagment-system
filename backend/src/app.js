import express from 'express'
const app = express()
import cookie from 'cookie-parser'
import authrouter from './routes/auth.routes.js'
import attendrouter from './routes/attend.routes.js'
import leaverouter from './routes/leave.route.js'
import adminrouter from './routes/admin.routes.js'
import cors from 'cors'
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:5173",
        "https://hr-mnagment-system.vercel.app"
      
        
    ]
}));
app.use(express.json());
app.use(cookie())
app.use("/api/auth",authrouter)
app.use("/api/attend",attendrouter)
app.use("/api/leave",leaverouter)
app.use("/api/admin",adminrouter)





export default app
