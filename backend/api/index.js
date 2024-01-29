import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import cors from 'cors'
import 'dotenv/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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

  const s3Client = new S3Client({
    region: 'eu-central-1',
    credentials: {
      accessKeyId: process.env.AWS_PK,
      secretAccessKey: process.env.AWS_SK,
    },
  })

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
      const bucket = process.env.BUCKET_NAME
      const bucketUrl = process.env.BUCKET_URL
      let convertedImageSizeInKB

      await sharp(file.buffer)
        .resize(
          width === '' ? null : parseInt(width),
          height === '' ? null : parseInt(height),
          {
            fit: fit,
          },
        )
        .toFormat(format)
        .withMetadata(strip === 'yes' ? {} : undefined)
        .toBuffer()
        .then(async convertedImageBuffer => {
          convertedImageSizeInKB = convertedImageBuffer.length / 1024
          const params = {
            Bucket: bucket,
            Key: imageName,
            ACL: 'public-read',
            ContentType: file.type,
            Body: convertedImageBuffer,
          }

          try {
            await s3Client.send(new PutObjectCommand(params))
            console.log(`Image uploaded to S3: ${imageName}`)
          } catch (error) {
            console.error(`Error uploading to S3: ${error.message}`)
          }
        })
        .then(() => {
          convertedImageData.push({
            name: file.originalname,
            imageUrl: `${bucketUrl}/${imageName}`,
            newName: imageName,
            newFormat: format,
            newSize: convertedImageSizeInKB,
          })
        })
    }

    res.json({ convertedImageData })
  } catch (error) {
    console.error(`Error converting image: ${error.message}`)
    res.status(500).json({ message: 'Error converting image' })
  }
})

if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist')

  app.use(express.static(frontendDistPath))

  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendDistPath, 'index.html')),
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.listen(process.env.PORT || 3000, () =>
  console.log('Server listening on port 3000'),
)
