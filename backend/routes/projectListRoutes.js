const express = require('express');
const router = express.Router();
const Project = require('../models/ProjectList');

// Create a new project
router.post('/', async (req, res, next) => {
  const project = new Project(req.body);
  project.save()
    .then(() => res.status(201).json({ message: 'Project created successfully' }))
    .catch(next); // Pass error to errorHandler
});

// Get all projects (with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const {
      year, class: classVal, division, guideName,
      groupName, studentName, title, category,
      projectType, abstract
    } = req.query;

    if (year) filter.year = year;
    if (classVal) filter.class = classVal;
    if (division) filter.division = division;
    if (guideName) filter.guideName = { $regex: guideName, $options: 'i' };
    if (groupName) filter.groupName = { $regex: groupName, $options: 'i' };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (projectType) filter.projectType = projectType;
    if (abstract) filter.abstract = { $regex: abstract, $options: 'i' };
    if (studentName) {
      filter['students.name'] = { $regex: studentName, $options: 'i' };
    }

    const projects = await Project.find(filter).sort({ year: -1, class: 1, division: 1 });
    res.json(projects);
  } catch (err) {
    next(err); //  Pass to global error handler
  }
});

//  Update a project
router.put('/:id', async (req, res, next) => {
  Project.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ message: 'Project updated successfully' }))
    .catch(next);
});

//  Delete a project
router.delete('/:id', async (req, res, next) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Project deleted successfully' }))
    .catch(next);
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
