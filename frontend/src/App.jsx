import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/primarycomp/Header";
import About from "./pages/primarycomp/About";
import Recruit from "./pages/Recruiter/recruit";
import Jobinput from "./pages/Recruiter/Jobinput";
import Recruitprofile from "./pages/Recruiter/recruitprofile";
import Jobs from "./pages/Seeker/Jobs";
import Exam from "./pages/Seeker/exam";
import UserDash from "./pages/Seeker/Homepage";
import Analyze from "./pages/Seeker/answer";
import UserDashboard from "./pages/Seeker/UploadResume";
import FetchData from "./pages/Seeker/circles";
import LoadingComponent from "./pages/primarycomp/Loading";
import ProtectedRoute from "./pages/Protectionroute"; // Import the ProtectedRoute component
import FullscreenComponent from "./pages/Seeker/test";
import JobSearch from "./pages/Seeker/Jobsfromapi"
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Accessible to anyone */}
        <Route path="/" element={<UserDash />} />
        <Route path="/home" element={<UserDash />} />
        <Route path="/resume" element={<UserDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/tst" element={<FullscreenComponent />} />
        <Route path="/rapidapi" element={<JobSearch />} />
        
        {/* Protected routes for seekers */}
        <Route
          path="/jobs"
          element={<ProtectedRoute element={<Jobs />} seekerOnly />}
        />
        <Route
          path="/test"
          element={<ProtectedRoute element={<Exam />} seekerOnly />}
        />

        {/* Protected routes for recruiters */}
        <Route
          path="/jobinput"
          element={<Jobinput />}
        />
        <Route
          path="/rprofile"
          element={
            <ProtectedRoute element={<Recruitprofile />} recruiterOnly />
          }
        />

        {/* Accessible to anyone */}
        <Route path="/anal" element={<Analyze />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      
    </Router>
  );
}

export default App;
