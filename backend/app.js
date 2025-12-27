const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const guideRoutes = require('./routes/guideRoutes');
const projectRoutes = require('./routes/projectListRoutes');
const noticesRoutes = require('./routes/noticeRoutes');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const studentPreferenceRoutes = require('./routes/StudentPreferenceRoutes');

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));
  

app.use('/api/guide', guideRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student-preference', studentPreferenceRoutes);

// ✅ Error handler goes last
app.use(errorHandler);
module.exports = app;
