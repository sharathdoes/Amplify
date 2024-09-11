import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/primarycomp/Header';
import Home from './pages/primarycomp/Home';
import About from './pages/primarycomp/About';
import UserDashboard from './pages/Seeker/UploadResume';
import Recruit from './pages/Recruiter/recruit';
import Jobinput from './pages/Recruiter/Jobinput';
import Recruitprofile from './pages/Recruiter/recruitprofile';
import Jobs from './pages/Seeker/Jobs'
import Exam from './pages/Seeker/exam';
import PowerButton from './pages/primarycomp/PowerButton';
import PowerB from './pages/primarycomp/power';
import AnalyzeAnswer from "./pages/Seeker/analsye"
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<UserDashboard />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/Jobinput" element={<Jobinput />} />
        <Route path="/rprofile" element={<Recruitprofile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/test" element={<Exam />} />
        <Route path="/anal" element={<AnalyzeAnswer />} />
      </Routes>
      <PowerButton/>
      <PowerB/>
    </Router>
  );
}

export default App;
