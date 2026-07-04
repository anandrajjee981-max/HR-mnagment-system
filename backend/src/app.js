import express from 'express'
const app = express()
import cookie from 'cookie-parser'
import authrouter from './routes/auth.routes.js'
app.use(express.json());
app.use(cookie())
app.use("/api/auth",authrouter)








export default app
