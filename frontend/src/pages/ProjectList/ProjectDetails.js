import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      alert("Project deleted successfully");
      navigate("/projects");
    } catch (err) {
      console.error("Error deleting project", err);
      alert("Failed to delete the project.");
    }
  };

  const handleEdit = () => {
    navigate(`/projects/edit/${id}`);
  };

  if (!project) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>Project Details</h3>
      <Link to="/projects" className="btn btn-secondary mb-3">← Back to List</Link>
      <div className="card p-3 mb-3">
        <p><strong>Year:</strong> {project.year}</p>
        <p><strong>Class:</strong> {project.class}</p>
        <p><strong>Division:</strong> {project.division}</p>
        <p><strong>Group:</strong> {project.groupName}</p>
        <p><strong>Guide:</strong> {project.guideName}</p>
        <p><strong>Title:</strong> {project.title}</p>
        <p><strong>Abstract:</strong> {project.abstract}</p>
        <p><strong>Category:</strong> {project.category}</p>

        <h5>Students:</h5>
        <ul>
          {project.students.map((s, idx) => (
            <li key={idx}>
              {s.name} ({s.rollNo}) - {s.email} / {s.mobile}
            </li>
          ))}
        </ul>

        <h5>POs/PSOs & Justifications:</h5>
        <ul>
          {project.posPsos.map((po, idx) => (
            <li key={idx}><strong>{po.poAndPso}</strong>: {po.justification}</li>
          ))}
        </ul>

        <p><strong>Project Type:</strong> {project.projectType}</p>
        <p><strong>Relevance:</strong> {project.projectRelevance}</p>

        <p>
          <strong>Sponsorship:</strong> {project.sponsorship?.hasSponsorship ? 'Yes' : 'No'}
          {project.sponsorship?.documentPath && (
            <> — <a href={project.sponsorship.documentPath} target="_blank" rel="noreferrer">View Document</a></>
          )}
        </p>

        <p>
          <strong>SIH:</strong> {project.sih?.isSIH ? 'Yes' : 'No'}
          {project.sih?.statNo && (
            <> — <strong>Problem Statement No:</strong> {project.sih.statNo}</>
          )}
          {project.sih?.documentPath && (
            <> — <a href={project.sih.documentPath} target="_blank" rel="noreferrer">View File</a></>
          )}
        </p>

        {project.ReportLink && (
          <p><strong>Report:</strong> <a href={project.ReportLink} target="_blank" rel="noreferrer">View Report</a></p>
        )}
      </div>

      <div className="mb-4">
        <button className="btn btn-warning me-2" onClick={handleEdit}>Edit</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ProjectDetails;
