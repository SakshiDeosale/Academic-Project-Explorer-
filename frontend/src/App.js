// src/App.js

//import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './pages/UserLogin/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

import GuideMain from './pages/Guide/GuideMain';
import GuidePreference from './pages/Guide/GuidePreference';
import AddPreference from './pages/Guide/AddPreference';
import ViewPreference from './pages/Guide/ViewPreference';
import FilteredView from './pages/Guide/FilteredView';

import Notices from './pages/Notices/Notices';

import ProjectList from './pages/ProjectList/ProjectList';
import AddProject from './pages/ProjectList/AddProject';
import ProjectDetails from './pages/ProjectList/ProjectDetails';
import EditProject from './pages/ProjectList/EditProject';
import StudentPreference from './pages/Student/StudentPreference';

import AddUser from './pages/UserLogin/AddUser';

const ProtectedLayout = () => (
  <>
    <Sidebar />
    <div className="main-content p-3">
      <Outlet />
    </div>
  </>
);

function App() {
  const isAuthenticated = !!localStorage.getItem('isLoggedIn');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Guide Preferences */}
            <Route path="/guide" element={<GuideMain />} />
            <Route path="/guide/preference" element={<GuidePreference />} />
            <Route path="/guide/preference/add" element={<AddPreference />} />
            <Route path="/guide/preference/view" element={<ViewPreference />} />
            <Route path="/guide/preference/view/:year" element={<FilteredView />} />

            {/* Notices & Circulars */}
            <Route path="/notices" element={<Notices />} />

            {/* Projects */}
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/add" element={<AddProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/projects/edit/:id" element={<EditProject />} />
            
            {/* Student Preference */}
            <Route path="/student" element={<StudentPreference />} />

            {/* Admin User Add */}
            <Route path="/add-user" element={<AddUser />} />
          </Route>
        ) : (
          // Redirect all other routes to login if not authenticated
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
