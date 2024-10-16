import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import toast from Sonner
import axios from "axios";
export default function Jobinput() {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [topic, setTopic] = useState(""); // Topic input for Gemini
  const [questions, setQuestions] = useState([]);
  const [inputMethod, setInputMethod] = useState("manual"); // State for input method (manual or gemini)
  const [loading, setLoading] = useState(false); // Loading state for Gemini
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("jodId"); // Ensure this is the correct query parameter
  
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
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("jobId");
    if (jobId) {
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
        } catch (error) {
          console.error("Error fetching job details:", error.response?.data || error.message);
        }
      };
      fetchJobDetails();
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (field === 'options') {
        updatedQuestions[index][field] = value.split(',').map((opt) => opt.trim());
      } else {
        updatedQuestions[index][field] = value;
      }
      return updatedQuestions;
    });
  };

  const generateQuestions = async () => {
    setLoading(true); // Set loading to true when Gemini starts
    let allQuestions = [];
  
    try {
      // Loop 10 times for 100 questions
        const response = await apiClient.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA2Akt5sQLfZqAC4ol1ayeJBueLOMzBIcQ",
          {
            contents: [
              {
                parts: [
                  {
                    text: `Generate 10 questions on the topic: "${topic}" in the following array format: 
                    {
                      question: { type: String, required: true },
                      options: { type: [String], required: true },
                      correctOption: { type: String, required: true }
                    }`
                  },
                ],
              },
            ],
          }
        );
  
        const generatedText = response.data.candidates[0].content.parts[0].text;
        const regex = /{[\s\S]*?}/g;
        const matches = generatedText.match(regex);
  
        if (matches) {
          matches.forEach((match) => {
            try {
              const questionObj = eval(`(${match})`);
  
              // Validate question object
              if (
                typeof questionObj.question === "string" &&
                Array.isArray(questionObj.options) &&
                questionObj.options.every(option => typeof option === "string" && option.trim()) &&
                typeof questionObj.correctOption === "string" &&
                questionObj.correctOption.trim()
              ) {
                allQuestions.push(questionObj);
              } else {
                console.warn('Skipping invalid question object:', questionObj);
              }
            } catch (err) {
              console.warn('Skipping invalid JSON-like object', err);
            }
          });
        }
      
  
      // Set questions and alert if any were invalid
      setQuestions(allQuestions);
      if (allQuestions.length < 100) {
        toast.error("Some generated questions were invalid. Please review the input.");
      } else {
        toast.success("Questions generated successfully!");
      }
  
      console.log("Questions set from Gemini: ", allQuestions); // Debugging console log
      console.log(allQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Error generating questions");
    } finally {
      setLoading(false); // Set loading to false when generation is complete
    }
  };
  


  console.log("hi")
  const handleJobs = async (e) => {
    e.preventDefault();
  
    // Validate questions before sending
    const validQuestions = questions.filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length > 0 && 
      q.correctOption
    );
  
    if (validQuestions.length !== questions.length) {
      console.warn("Some questions are invalid. Please check your entries.");
      alert("Please ensure all questions have valid data.");
      return;
    }
  
    const jobData = {
      tokenId: userInfo.tokenId,
      ...jobDetails,
      skills: jobDetails.skills.split(',').map(skill => skill.trim()),
      questions: validQuestions,
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
        <h1 className="text-2xl mr-48 font-bold tracking-tighter sm:text-4xl text-center mb-4">
          Hello, Recruiter from {userInfo.companyName}!
        </h1>
      </div>
      <form className="space-y-8 max-w-2xl mx-auto shadow-xl p-6" onSubmit={handleJobs}>
        {/* Input fields for job details */}
        <div className="space-y-4">
          {/* Other input fields here... */}
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


          {/* Radio group to choose between manual input and Gemini */}
          <div className="space-y-2">
            <Label>Question Input Method</Label>
            <RadioGroup value={inputMethod} onValueChange={setInputMethod} className="flex space-x-4">
              <div>
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual">Manual Entry</Label>
              </div>
              <div>
                <RadioGroupItem value="gemini" id="gemini" />
                <Label htmlFor="gemini">Use Gemini</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show manual question input fields if manual is selected */}
          {inputMethod === 'manual' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  value={questions.length}
                  onChange={(e) => handleNumQuestionsChange(e.target.value)}
                  required
                />
              </div>
              {questions.map((_, index) => (
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
                    <Label htmlFor={`options-${index}`}>Options (comma separated)</Label>
                    <Input
                      id={`options-${index}`}
                      placeholder="Option 1, Option 2, Option 3, Option 4"
                      value={questions[index]?.options.join(', ') || ''}
                      onChange={(e) => handleQuestionChange(index, 'options', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`correctOption-${index}`}>Correct Option</Label>
                    <Input
                      id={`correctOption-${index}`}
                      placeholder="Correct Option"
                      value={questions[index]?.correctOption || ''}
                      onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Show Gemini option */}
          {inputMethod === 'gemini' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="topic">Enter Topic for Question Generation</Label>
                <Input
                  id="topic"
                  placeholder="Enter topic here"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              <Button onClick={generateQuestions} disabled={loading}>
                {loading ? "Generating Questions..." : `Generate 100 Questions on "${topic}" with Gemini`}
              </Button>
            </>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving Job..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
}
