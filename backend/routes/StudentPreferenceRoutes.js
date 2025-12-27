const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const StudentPreference = require('../models/StudentPreference');

// Multer config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error('Only Excel files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Upload preference
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { year, division } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(400).json({ error: 'File is missing from server!' });
    }

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const saved = await StudentPreference.create({
      fileName: file.originalname,
      filePath: file.path, // Store file path for download
      year,
      division,
      data,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error('Error during upload:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all preferences
router.get('/', async (req, res) => {
  try {
    const all = await StudentPreference.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get preference by ID
router.get('/:id', async (req, res) => {
  try {
    const file = await StudentPreference.findById(req.params.id);
    res.json(file.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update preference
router.put('/:id', async (req, res) => {
  try {
    const { year, division } = req.body;
    const updated = await StudentPreference.findByIdAndUpdate(
      req.params.id,
      { year, division },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete preference
router.delete('/:id', async (req, res) => {
  try {
    const file = await StudentPreference.findByIdAndDelete(req.params.id);
    if (file?.filePath && fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath); // delete the uploaded file
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download preference file
router.get('/download/:id', async (req, res) => {
  try {
    const file = await StudentPreference.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    if (!fs.existsSync(file.filePath)) return res.status(404).send('File is missing on server');

    res.download(file.filePath, file.fileName);
  } catch (err) {
    console.error('Error in download route:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;