import multer from 'multer'

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage()

// Create the multer upload middleware
const upload = multer({ storage })

export default upload
