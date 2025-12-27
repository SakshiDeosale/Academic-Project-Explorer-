import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (index, e) => {
    const updated = [...project.students];
    updated[index][e.target.name] = e.target.value;
    setProject({ ...project, students: updated });
  };

  const handlePosPsoChange = (index, e) => {
    const updated = [...project.posPsos];
    updated[index][e.target.name] = e.target.value;
    setProject({ ...project, posPsos: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, project);
      alert('Project updated successfully');
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update project');
    }
  };

  if (!project) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>Edit Project</h3>
      <form onSubmit={handleSubmit} className="card p-3">

        <input className="form-control mb-2" name="year" value={project.year} onChange={handleChange} placeholder="Year" />
        <input className="form-control mb-2" name="class" value={project.class} onChange={handleChange} placeholder="Class (TY/BTech)" />
        <input className="form-control mb-2" name="division" value={project.division} onChange={handleChange} placeholder="Division" />
        <input className="form-control mb-2" name="groupName" value={project.groupName} onChange={handleChange} placeholder="Group Name" />
        <input className="form-control mb-2" name="guideName" value={project.guideName} onChange={handleChange} placeholder="Guide Name" />
        <input className="form-control mb-2" name="title" value={project.title} onChange={handleChange} placeholder="Project Title" />
        <textarea className="form-control mb-2" name="abstract" value={project.abstract} onChange={handleChange} placeholder="Abstract" />
        <input className="form-control mb-2" name="category" value={project.category} onChange={handleChange} placeholder="Category" />
        <input className="form-control mb-2" name="projectType" value={project.projectType} onChange={handleChange} placeholder="Project Type" />
        <input className="form-control mb-2" name="projectRelevance" value={project.projectRelevance} onChange={handleChange} placeholder="Relevance" />
        <input className="form-control mb-2" name="ReportLink" value={project.ReportLink} onChange={handleChange} placeholder="Report Link" />

        <h5>Students</h5>
        {project.students.map((s, index) => (
          <div key={index} className="container mt-4">
            <input className="form-control mb-2" name="rollNo" value={s.rollNo} onChange={(e) => handleStudentChange(index, e)} placeholder="Roll No" />
            <input className="form-control mb-2" name="name" value={s.name} onChange={(e) => handleStudentChange(index, e)} placeholder="Name" />
            <input className="form-control mb-2" name="email" value={s.email} onChange={(e) => handleStudentChange(index, e)} placeholder="Email" />
            <input className="form-control mb-2" name="mobile" value={s.mobile} onChange={(e) => handleStudentChange(index, e)} placeholder="Mobile" />
          </div>
        ))}

        <h5>POs/PSOs</h5>
        {project.posPsos.map((p, index) => (
          <div key={index} className="container mt-4">
            <input className="form-control mb-2" name="poAndPso" value={p.poAndPso} onChange={(e) => handlePosPsoChange(index, e)} placeholder="PO or PSO" />
            <input className="form-control mb-2" name="justification" value={p.justification} onChange={(e) => handlePosPsoChange(index, e)} placeholder="Justification" />
          </div>
        ))}

        <h5>Sponsorship</h5>
        <input className="container mt-4" name="sponsorship.documentPath" value={project.sponsorship?.documentPath || ''} onChange={(e) => setProject(prev => ({
          ...prev,
          sponsorship: { ...prev.sponsorship, documentPath: e.target.value }
        }))} placeholder="Sponsorship Document Link" />
        <select className="form-control mb-2" value={project.sponsorship?.hasSponsorship ? 'Yes' : 'No'} onChange={(e) =>
          setProject(prev => ({
            ...prev,
            sponsorship: { ...prev.sponsorship, hasSponsorship: e.target.value === 'Yes' }
          }))
        }>
          <option value="No">Sponsored? No</option>
          <option value="Yes">Sponsored? Yes</option>
        </select>

        <h5>SIH</h5>
        <input className="container mt-4" name="sih.statNo" value={project.sih?.statNo || ''} onChange={(e) =>
          setProject(prev => ({
            ...prev,
            sih: { ...prev.sih, statNo: e.target.value }
          }))
        } placeholder="Problem Statement No" />
        <input className="form-control mb-2" name="sih.documentPath" value={project.sih?.documentPath || ''} onChange={(e) =>
          setProject(prev => ({
            ...prev,
            sih: { ...prev.sih, documentPath: e.target.value }
          }))
        } placeholder="SIH Document Link" />
        <select className="form-control mb-2" value={project.sih?.isSIH ? 'Yes' : 'No'} onChange={(e) =>
          setProject(prev => ({
            ...prev,
            sih: { ...prev.sih, isSIH: e.target.value === 'Yes' }
          }))
        }>
          <option value="No">SIH? No</option>
          <option value="Yes">SIH? Yes</option>
        </select>

        <button className="btn btn-success mt-3">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;
