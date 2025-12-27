const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../models/Notice');

const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'notices');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🔺 Upload Notice File
router.post('/upload', upload.single('file'), async (req, res, next) => {
  const { year } = req.body;
  const fileUrl = `/uploads/notices/${req.file.filename}`;
  const notice = new Notice({ year, fileUrl });

  notice.save()
    .then(() => res.status(200).json({ message: 'Notice uploaded successfully', fileUrl, year }))
    .catch(next);
});

//  Get All Notices
router.get('/', async (req, res, next) => {
  Notice.find()
    .then(notices => res.json(notices))
    .catch(next);
});

//  Delete Notice by ID
router.delete('/:id', async (req, res, next) => {
  Notice.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ message: 'Notice deleted successfully' }))
    .catch(next);
});

module.exports = router;
