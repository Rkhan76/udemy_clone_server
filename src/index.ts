import express, {
  Application,
  Request,
  Response,
  NextFunction,
  urlencoded,
} from 'express'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth'
import courseRouter from './routes/course'
import uploadRouter from './routes/upload'
import categoryRoutes from './routes/category'
import attachmentsRoutes from './routes/attachments'

dotenv.config()

const app: Application = express()
const PORT: number = parseInt(process.env.PORT || '5000', 10)

// CORS options
const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())





// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/course', courseRouter)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/attachments', attachmentsRoutes)

// Error-handling middleware must come last
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  })
})

// Start the server
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`)
})
