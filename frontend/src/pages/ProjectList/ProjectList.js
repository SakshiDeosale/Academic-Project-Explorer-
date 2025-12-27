import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const combined = [
        project.year,
        project.class,
        project.division,
        project.groupName,
        project.guideName,
        project.title,
        project.abstract,
        project.category,
        project.projectType,
        project.projectRelevance,
        ...(project.students.map(s => `${s.name} ${s.rollNo}`) || [])
      ].join(' ').toLowerCase();

      return combined.includes(searchTerm.toLowerCase());
    });

    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const downloadExcel = () => {
    const worksheetData = [];
    
    filteredProjects.forEach((project) => {
      project.students.forEach((student, index) => {
        worksheetData.push({
          Year: index === 0 ? project.year : '',
          Class: index === 0 ? project.class : '',
          Division: index === 0 ? project.division : '',
          GroupName: index === 0 ? project.groupName : '',
          GuideName: index === 0 ? project.guideName : '',
          Title: index === 0 ? project.title : '',
          Abstract: index === 0 ? project.abstract : '',
          Category: index === 0 ? project.category : '',
          Students: `${student.rollNo} - ${student.name} (${student.email}, ${student.mobile})`,
          POs_PSOs_Justifications: index === 0 ? project.justifications?.join('; ') || '' : '',
          ProjectType: index === 0 ? project.projectType : '',
          Relevance: index === 0 ? project.projectRelevance : '',
          Sponsored: index === 0 ? (project.sponsorship?.hasSponsorship ? 'Yes' : 'No') : '',
          SponsorshipDocumentLink: index === 0 ? project.sponsorship?.documentLink || '' : '',
          SIH: index === 0 ? (project.sih?.isSIH ? 'Yes' : 'No') : '',
          SIHProblemNo: index === 0 ? (project.sih?.StatNo || '—') : '',
          SIHDocumentLink: index === 0 ? project.sih?.documentLink || '' : '',
          ReportLink: index === 0 ? project.reportLink || '' : ''
        });
      });
    });
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { r: range.s.r, c: col };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!worksheet[cellRef]) worksheet[cellRef] = {};
      worksheet[cellRef].s = headerStyle;
    }
  
    const maxWidths = worksheetData.reduce((widths, row) => {
      Object.values(row).forEach((value, i) => {
        const len = value ? value.toString().length : 10;
        widths[i] = Math.max(widths[i] || 10, len);
      });
      return widths;
    }, []);
  
    worksheet['!cols'] = maxWidths.map((w) => ({ wch: w + 5 }));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  
    XLSX.writeFile(workbook, 'Project_List.xlsx');
  };

  return (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{ textAlign: 'center' }}>All Projects</h3>
      <div style={{ display: 'flex', marginBottom: '10px', width: '100%', flexDirection: 'row', gap: '10px' }}>
      <input
        type="text"
        className="form-control"
        placeholder="🔍Search by any field..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '70%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          outline: 'none', // prevent default blue glow
        }}
        onFocus={(e) => (e.target.style.border = '1px solid #66b3ff')}
        onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
      />

        <Link
          to="/projects/add"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            alignSelf: 'center',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Add Project
        </Link>
        <button
          className="btn btn-success"
          onClick={downloadExcel}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Download Excel
        </button>
      </div>

      <table className="table table-sm table-bordered" style={{ width: '100%' }}>
        <thead>
          <tr style={{
            backgroundColor: '#f0f0f0',
            color: '#333',
            fontWeight: 'bold',
            borderBottom: '2px solid #ddd'
          }}>
                  
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Year</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Class</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Division</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Group</th>
          <th style={{ width: '8%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Category</th>
          <th style={{ width: '8%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Guide</th>
          <th style={{ width: '15%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Title</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Roll No</th>
          <th style={{ width: '10%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Students</th>
          <th style={{ width: '8%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Project Type</th>
          <th style={{ width: '8%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Relevance</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>Sponsored</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>SIH</th>
          <th style={{ width: '5%', backgroundColor: '#f2f2f2', color: 'black', textAlign: 'center' }}>SIH Problem No</th>
        </tr>

        </thead>
        <tbody>
        {filteredProjects.map((p, i) => (
            <React.Fragment key={i}>
              <tr>
                <td>{p.year}</td>
                <td>{p.class}</td>
                <td>{p.division}</td>
                <td>{p.groupName}</td>
                <td>{p.category}</td>
                <td>{p.guideName}</td>
                <td>
                  <Link to={`/projects/${p._id}`}>{p.title}</Link>
                </td>
                <td>{p.students[0]?.rollNo}</td>
                <td>{p.students[0]?.name}</td>
                <td>{p.projectType}</td>
                <td>{p.projectRelevance}</td>
                <td>{p.sponsorship?.hasSponsorship ? 'Yes' : 'No'}</td>
                <td>{p.sih?.isSIH ? 'Yes' : 'No'}</td>
                <td>{p.sih?.statNo ? p.sih.statNo : '—'}</td>
              </tr>

              {p.students.slice(1).map((s, idx) => (
                <tr key={`${i}-${idx}`}>
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
