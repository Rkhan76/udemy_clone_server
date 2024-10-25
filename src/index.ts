import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'

import authRouter from "./routes/auth"

dotenv.config()

const app: Application = express()
const PORT: number = parseInt(process.env.PORT || '5000', 10)

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/v1/auth', authRouter)

// Error-handling middleware must come last
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  })
})


app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`)
})
