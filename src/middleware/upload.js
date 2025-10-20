const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]+/gi, '-')
    cb(null, `${Date.now()}-${base}${ext || '.jpg'}`)
  }
})

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Apenas imagens'))
  cb(null, true)
}

const maxMb = parseInt(process.env.MAX_FILE_SIZE_MB || '2')

const upload = multer({ storage, fileFilter, limits: { fileSize: maxMb * 1024 * 1024 } })

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const out = filePath.replace(ext, `.webp`)
  try {
    await sharp(filePath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out)
    // swap files to use webp
    fs.unlinkSync(filePath)
    return out
  } catch (e) {
    return filePath
  }
}

module.exports = { upload, compressImage }
