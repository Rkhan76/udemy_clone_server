import multer from 'multer' // Import multer
import fs from 'fs' // Import fs
import path from 'path'

// Define upload directory
const uploadDir = path.join(__dirname, '../uploads')

// Check if the upload directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// Create the multer upload middleware
const upload = multer({ storage: storage })

export default upload
