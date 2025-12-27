const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
});

// ✅ Justification is now inside posPsoSchema
const posPsoSchema = new mongoose.Schema({
  poAndPso: { type: String, required: true },
  justification: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  year: { type: String, required: true },
  class: { type: String, enum: ['TY', 'BTech'], required: true },
  division: { type: String, enum: ['A', 'B', 'C'], required: true },
  groupName: { type: String, required: true },
  guideName: { type: String, required: true },

  students: [studentSchema],

  category: String,
  title: { type: String, required: true },
  abstract: String,

  posPsos: [posPsoSchema],

  projectType: String,
  projectRelevance: String,

  sponsorship: {
    hasSponsorship: Boolean,
    documentPath: String,
  },
  sih: {
    isSIH: Boolean,
    statNo:Number,
    documentPath: String,
  },

  ReportLink: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProjectList', projectSchema);
