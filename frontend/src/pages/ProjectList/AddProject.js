import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function AddProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    year: '', class: '', division: '', groupName: '', guideName: '',
    title: '', category: '', abstract: '',
    students: [{ rollNo: '', name: '', email: '', mobile: '' }],
    posPsos: [{ poAndPso: '', justification: '' }],
    projectType: '', projectRelevance: '',
    sponsorship: { hasSponsorship: false, documentPath: '' },
    sih: { isSIH: false, documentPath: '' },
    ReportLink: ''
  });

  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [showOtherType, setShowOtherType] = useState(false);
  const [showOtherRelevance, setShowOtherRelevance] = useState(false);


  // Handle changes for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle students dynamic fields
  const handleStudentChange = (index, e) => {
    const updated = [...form.students];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, students: updated });
  };

  const addStudent = () => {
    setForm({ ...form, students: [...form.students, { rollNo: '', name: '', email: '', mobile: '' }] });
  };

  const removeStudent = (index) => {
    const updated = form.students.filter((_, i) => i !== index);
    setForm({ ...form, students: updated });
  };

  // Handle posPsos dynamic fields
  const handlePosPsoChange = (index, e) => {
    const updated = [...form.posPsos];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, posPsos: updated });
  };

  const addPosPso = () => {
    setForm({ ...form, posPsos: [...form.posPsos, { poAndPso: '', justification: '' }] });
  };

  const removePosPso = (index) => {
    const updated = form.posPsos.filter((_, i) => i !== index);
    setForm({ ...form, posPsos: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/projects', form);
    navigate('/projects');
  };

  return (
    <div className="container mt-4">
      <h3>Add New Project</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="year" placeholder="Year" onChange={handleChange} required />
        <input className="form-control mb-2" name="class" placeholder="Class (TY or BTech)" onChange={handleChange} required />
        <input className="form-control mb-2" name="division" placeholder="Division (A/B/C)" onChange={handleChange} required />
        <input className="form-control mb-2" name="groupName" placeholder="Group Name" onChange={handleChange} required />
        <input className="form-control mb-2" name="guideName" placeholder="Guide Name" onChange={handleChange} required />
        <input className="form-control mb-2" name="title" placeholder="Project Title" onChange={handleChange} required />
        <textarea className="form-control mb-2" name="abstract" placeholder="Abstract" onChange={handleChange} />
  
        <select
          className="form-control mb-2"
          name="category"
          onChange={(e) => {
            handleChange(e);
            setShowOtherCategory(e.target.value === 'Other');
          }}
          required
        >
          <option value="">Select Project Category</option>
          <option value="Mini Project">Mini Project</option>
          <option value="Major Project">Major Project</option>
          <option value="Other">Other</option>
        </select>
  
        {showOtherCategory && (
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter other category"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        )}
  
        <hr />
        <h3>Students</h3>
        {form.students.map((student, index) => (
          <div key={index} className="container mt-4"> {/* No extra container */}
            <input className="form-control mb-2" name="rollNo" placeholder="Roll No" value={student.rollNo} onChange={(e) => handleStudentChange(index, e)} required />
            <input className="form-control mb-2" name="name" placeholder="Name" value={student.name} onChange={(e) => handleStudentChange(index, e)} required />
            <input className="form-control mb-2" name="email" placeholder="Email" value={student.email} onChange={(e) => handleStudentChange(index, e)} required />
            <input className="form-control mb-2" name="mobile" placeholder="Mobile" value={student.mobile} onChange={(e) => handleStudentChange(index, e)} required />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeStudent(index)}
                className="btn btn-sm btn-danger mb-3"
              >
                Remove Student
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addStudent} className="btn btn-sm btn-secondary mb-3">+ Add Student</button>

        <hr />
        <h3>POs/PSOs & Justification</h3>
        {form.posPsos.map((pos, index) => (
          <div key={index} className="container mt-4">
            <input className="form-control mb-2" name="poAndPso" placeholder="PO or PSO" value={pos.poAndPso} onChange={(e) => handlePosPsoChange(index, e)} required />
            <input className="form-control mb-2" name="justification" placeholder="Justification" value={pos.justification} onChange={(e) => handlePosPsoChange(index, e)} required />
            {index > 0 && <button type="button" onClick={() => removePosPso(index)} className="btn btn-sm btn-danger">Remove</button>}
          </div>
        ))}
        <button type="button" onClick={addPosPso} className="btn btn-sm btn-secondary mb-3">+ Add PO/PSO</button>

        <select
        className="form-control mb-2"
        name="projectType"
        onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, projectType: value });
            setShowOtherType(value === 'Other');
        }}
        required
        >
        <option value="">Select Project Type</option>
        <option value="Application">Application</option>
        <option value="Product">Product</option>
        <option value="Research & Review">Research & Review</option>
        <option value="Tools & Frameworks">Tools & Frameworks</option>
        <option value="Other">Other</option>
        </select>

        {showOtherType && (
        <input
            className="form-control mb-2"
            name="projectType"
            placeholder="Enter Project Type"
            onChange={handleChange}
        />
        )}


        <select
        className="form-control mb-2"
        name="projectRelevance"
        onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, projectRelevance: value });
            setShowOtherRelevance(value === 'Other');
        }}
        required
        >
        <option value="">Select Relevance of Project</option>
        <option value="Environment and Sustainability">Environment and Sustainability</option>
        <option value="Safety & Security">Safety & Security</option>
        <option value="Society & Ethics">Society & Ethics</option>
        <option value="Automation">Automation</option>
        <option value="Other">Other</option>
        </select>

        {showOtherRelevance && (
        <input
            type="text"
            name="projectRelevance"
            className="form-control mb-2"
            placeholder="Enter Relevance of Project"
            onChange={handleChange}
        />
        )}


        <div className="container mt-4">
          <h4>Is this project sponsored?</h4>
          <select
            className="form-control mb-2"
            value={form.sponsorship.hasSponsorship ? 'yes' : 'no'}
            onChange={(e) =>
              setForm({
                ...form,
                sponsorship: {
                  ...form.sponsorship,
                  hasSponsorship: e.target.value === 'yes',
                },
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {form.sponsorship.hasSponsorship && (
          <input
            className="form-control mb-2"
            placeholder="Sponsorship Document Link"
            value={form.sponsorship.documentPath}
            onChange={(e) =>
              setForm({
                ...form,
                sponsorship: {
                  ...form.sponsorship,
                  documentPath: e.target.value,
                },
              })
            }
          />
        )}


        {/* SIH Section */}
        <div className="container mt-4">
          <h4>Is this project for SIH?</h4>
          <select
            className="form-control mb-2"
            value={form.sih.isSIH ? 'yes' : 'no'}
            onChange={(e) =>
              setForm({
                ...form,
                sih: {
                  ...form.sih,
                  isSIH: e.target.value === 'yes',
                },
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {form.sih.isSIH && (
          <>
            <input
              className="form-control mb-2"
              placeholder="SIH Problem Statement Number"
              value={form.sih.problemStatementNumber || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  sih: {
                    ...form.sih,
                    problemStatementNumber: e.target.value,
                  },
                })
              }
            />
            <input
              className="form-control mb-2"
              placeholder="Paper/Publication Link"
              value={form.sih.documentPath}
              onChange={(e) =>
                setForm({
                  ...form,
                  sih: {
                    ...form.sih,
                    documentPath: e.target.value,
                  },
                })
              }
            />
          </>
        )}

        <input className="form-control mb-2" name="ReportLink" placeholder="Project Report Link" onChange={handleChange} />

        <button className="btn btn-success">Submit Project</button>
      </form>
    </div>
  );
}

export default AddProject;