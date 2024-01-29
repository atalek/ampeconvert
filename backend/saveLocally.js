import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import cors from 'cors'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const upload = multer()

// cors for development
app.use(
  cors({
    origin: process.env.DOMAIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.post('/api/v1/upload', upload.array('files'), async (req, res) => {
  const files = req.files
  const formats = Array.isArray(req.body.formats)
    ? req.body.formats
    : [req.body.formats]
  const widths = Array.isArray(req.body.widths)
    ? req.body.widths
    : [req.body.widths]
  const heights = Array.isArray(req.body.heights)
    ? req.body.heights
    : [req.body.heights]
  const fits = Array.isArray(req.body.fits) ? req.body.fits : [req.body.fits]
  const strips = Array.isArray(req.body.strips)
    ? req.body.strips
    : [req.body.strips]

  const convertedImageData = []

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const format = formats[i]
      const width = widths[i]
      const height = heights[i]
      const fit = fits[i]
      const strip = strips[i]

      const fileName = file.originalname.split('.')[0]
      const imageName = fileName + '.' + format
      const filePath = `uploads/${imageName}`

      await sharp(file.buffer)
        .resize(
          width === '' ? null : parseInt(width),
          height === '' ? null : parseInt(height),
          { fit: fit },
        )
        .toFormat(format)
        .withMetadata(strip === 'yes' ? {} : undefined)
        .toFile(filePath)
        .then(() => {
          console.log(`Image saved to uploads: ${filePath}`)
          convertedImageData.push({
            name: file.originalname,
            imageUrl: `http://localhost:3000/${filePath}`,
            newName: imageName,
            newFormat: format,
            newSize: file.size / 1024,
          })
        })
    }

    res.json({ convertedImageData })
  } catch (error) {
    console.error(`Error converting image: ${error.message}`)
    res.status(500).json({ message: 'Error converting image' })
  }
})

app.listen('3000', () => console.log('Server listening on port  3000'))
