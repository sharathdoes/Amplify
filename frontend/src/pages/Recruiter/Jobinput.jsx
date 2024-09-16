import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";

export default function Jobinput() {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  console.log('hi')
  console.log("Query string:", window.location.search);
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("jodId");
  
  console.log("Extracted jobId:", jobId);
  
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [jobDetails, setJobDetails] = useState({
    recruiterEmail: "",
    subRecruiterEmail: "",
    jobName: "",
    jobQualification: "",
    jobSalary: "",
    jobDescription: "",
    role: "",
    timePeriod: "",
    location: "",
    skills: "",
    experience: "",
    benefits: "",
    applicable: 0,
    referral: 0,
    applyLink: "",
  });

  useEffect(() => {
    if (jobId) {
      // Fetch job details if jobId exists (edit mode)
      const fetchJobDetails = async () => {
        try {
          const response = await apiClient.get(`/api/jobs/${jobId}`);
          const job = response.data;
          setJobDetails({
            recruiterEmail: job.recruiterEmail,
            subRecruiterEmail: job.subRecruiterEmail,
            jobName: job.jobName,
            jobQualification: job.jobQualification,
            jobSalary: job.jobSalary,
            jobDescription: job.jobDescription,
            role: job.role,
            timePeriod: job.timePeriod,
            location: job.location,
            skills: job.skills.join(", "),
            experience: job.experience,
            benefits: job.benefits,
            applicable: job.applicable,
            referral: job.referral,
            applyLink: job.applyLink,
          });
          setQuestions(job.questions || []);
          setNumQuestions(job.questions?.length || 0);
        } catch (error) {
          console.error("Error fetching job details:", error.response?.data || error.message);
        }
      };
      fetchJobDetails();
    }
  }, [jobId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setJobDetails(prevDetails => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumQuestions(value);
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions.length < value) {
        while (updatedQuestions.length < value) {
          updatedQuestions.push({ question: '', options: [''], correctOption: '' });
        }
      } else if (updatedQuestions.length > value) {
        updatedQuestions.length = value;
      }
      return updatedQuestions;
    });
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (field === 'options') {
        updatedQuestions[index][field] = value.split(',').map(opt => opt.trim());
      } else {
        updatedQuestions[index][field] = value;
      }
      return updatedQuestions;
    });
  };

  const handleJobs = async (e) => {
    e.preventDefault();

    const jobData = {
      tokenId: userInfo.tokenId,
      ...jobDetails,
      skills: jobDetails.skills.split(',').map(skill => skill.trim()),
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctOption: q.correctOption
      })),
    };

    try {
      if (jobId) {
        // Update existing job
        const response = await apiClient.post(`/api/jobs/${jobId}/up`, jobData);
        if (response.status === 200) {
          alert("Job updated successfully!");
        }
      } else {
        // Create a new job
        const response = await apiClient.post("/api/jobs", jobData);
        if (response.status === 201) {
          alert("Job posted successfully!");
        }
      }
      navigate('/rprofile');
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      alert("An error occurred while saving the job.");
    }
  };

  return (
    <div>
      <div className="space-y-2 pt-32">
        <h1 className="text-2xl mr-48 font-bold tracking-tighter sm:text-4xl text-center mb-4 animate__animated animate__fadeInDown">
          Hello, Recruiter from {userInfo.companyName}!
        </h1>
      </div>
      <form className="space-y-8 max-w-2xl mx-auto shadow-xl p-6" onSubmit={handleJobs}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recruiterEmail">Recruiter Email</Label>
              <Input id="recruiterEmail" type="email" placeholder="recruiter@company.com" value={jobDetails.recruiterEmail} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subRecruiterEmail">Sub-Recruiter Email</Label>
              <Input id="subRecruiterEmail" type="email" placeholder="subrecruiter@company.com" value={jobDetails.subRecruiterEmail} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobName">Job Title</Label>
            <Input id="jobName" placeholder="e.g. Senior Software Engineer" value={jobDetails.jobName} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobQualification">Job Qualifications</Label>
            <Input id="jobQualification" placeholder="e.g. Bachelor's in Computer Science" value={jobDetails.jobQualification} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobSalary">Salary Range</Label>
            <Input id="jobSalary" placeholder="e.g. $80,000 - $120,000 per year" value={jobDetails.jobSalary} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea 
              id="jobDescription" 
              placeholder="Provide a detailed description of the job role and responsibilities." 
              className="min-h-[100px]"
              value={jobDetails.jobDescription} 
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Employment Role</Label>
              <Input id="role" placeholder="e.g. Intern, Mid-level, Lead, Senior, Junior" value={jobDetails.role} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timePeriod">Duration</Label>
              <Input id="timePeriod" placeholder="e.g. 1 year, 6 months, Permanent" value={jobDetails.timePeriod} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. New York, NY or Remote" value={jobDetails.location} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Textarea 
              id="skills" 
              placeholder="List the required skills, separated by commas." 
              className="min-h-[80px]"
              value={jobDetails.skills} 
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input id="experience" placeholder="e.g. 5 years" value={jobDetails.experience} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Input id="benefits" placeholder="e.g. Health insurance, 401(k)" value={jobDetails.benefits} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicable">Applicable Value</Label>
            <Input
              id="applicable"
              placeholder="e.g. 0 or 1 this is for application"
              value={jobDetails.applicable}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">Referral Value</Label>
            <Input
              id="referral"
              placeholder="e.g. 0 or 1 this is for referral"
              value={jobDetails.referral}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applyLink">Application Link</Label>
            <Input
              id="applyLink"
              placeholder="https://company.com/apply"
              value={jobDetails.applyLink}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              required
            />
          </div>

          {Array.from({ length: numQuestions }).map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded">
              <div className="space-y-2">
                <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                <Textarea
                  id={`question-${index}`}
                  placeholder="Enter the question"
                  value={questions[index]?.question || ''}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`options-${index}`}>Options (comma-separated)</Label>
                <Textarea
                  id={`options-${index}`}
                  placeholder="Option 1, Option 2, Option 3, Option 4"
                  value={questions[index]?.options?.join(', ') || ''}
                  onChange={(e) => handleQuestionChange(index, 'options', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`correctOption-${index}`}>Correct Option</Label>
                <Input
                  id={`correctOption-${index}`}
                  placeholder="Enter the correct option"
                  value={questions[index]?.correctOption || ''}
                  onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full">
          {jobId ? "Update Job" : "Create Job"}
        </Button>
      </form>
    </div>
  );
}

