import multer from 'multer'

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept any file type; you can further customize this
    cb(null, true)
  },
})

export default upload
