const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'logo') {
      cb(null, 'uploads/logos');
    } else if (file.fieldname === 'nfe') {
      cb(null, 'uploads/nfe');
    } else {
      cb(null, 'uploads/produtos');
    }
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const filename = `${hash}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'nfe') {
    // NFe aceita apenas XML
    if (file.mimetype === 'text/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos XML são permitidos para NFe'));
    }
  } else {
    // Imagens
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens (JPEG, PNG, WEBP) são permitidas'));
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024 // 1MB default
  }
});

module.exports = upload;
