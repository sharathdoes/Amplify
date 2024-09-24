import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index";
import { useGoogleLogin } from '@react-oauth/google';
import {
  FiCalendar as CalendarIcon,
  FiMapPin as MapPin,
  FiDollarSign as DollarSign,
  FiEye as Eye,
  FiSearch as SearchIcon,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { apiClient } from '@/lib/apiClient';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function JobComponent() {
  const navigate = useNavigate();
  const selectedRole = useAppStore((state) => state.selectedRole);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState(""); // For handling the name input
  const [jobLevel, setJobLevel] = useState([]);
  const [datePosted, setDatePosted] = useState(null);
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRemote, setIsRemote] = useState(false); // For remote filter
  const setSeekerInfo = useAppStore((state) => state.setSeekerInfo);
  const { SeekerInfo } = useAppStore();
  console.log(SeekerInfo);
  useEffect(() => {
    fetchJobs(); // Fetch jobs on component mount
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.post("/api/jobsbykeyword", {
        query: searchTerm || selectedRole || "default role",
        jobLevel,
        datePosted,
        location: isRemote ? "Remote" : location // Send "Remote" if switch is enabled
      });
    
      // Log the response to check data
      console.log(response.data);
      const data = await response.data;
      setJobs(data);
      if (data.length > 0) {
        setSelectedJob(data[0]);
        console.log("Fetched job:", data[0]); // Check fetched job data
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleJobLevelFilter = (level) => {
    setJobLevel((prevLevels) => {
      if (prevLevels.includes(level)) {
        return prevLevels.filter((l) => l !== level);
      } else {
        return [...prevLevels, level];
      }
    });
  };

  const handleApplyFilters = () => {
    fetchJobs(); // Re-fetch jobs with applied filters
  };

  const handleTakeTest = () => {
    navigate(`/test?jobId=${selectedJob._id}`);
  };

  const onSuccess = async (res) => {
    console.log("Login Success:", res);
    const accessToken = res.access_token;
  
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userInfo = await userInfoResponse.json();
      const userId = userInfo.sub;
      console.log("User ID:", userId);
      console.log("User Name:", name);
  
      const response = await apiClient.post("http://localhost:6546/api/UserSignin", { tokenID: userId, name:name });
  
      if (response.status === 201) {
        setSeekerInfo(response.data.user);
        navigate(`/test?jobId=${selectedJob._id}`);
      }
    } catch (error) {
      console.error("Error signing in:", error.response?.data || error.message);
    }
  };

  const onFailure = (error) => {
    console.error("Login Failed:", error);
  };

  const signIn = useGoogleLogin({
    onSuccess,
    onFailure,
    scope: 'openid email profile',
    flow: 'implicit',
  });

  const handleGoogleSignIn = () => {
    if (!name.trim()) {
      alert("Please enter a name before signing in.");
      return;
    }
    signIn();
  };

  return (
    <div className="flex mt-12 bg-gray-50 h-screen w-full">
      {/* First Column: Filters and Search (20% width) */}
      <div className="w-[20%] p-4 mt-12 flex flex-col space-y-4 border-r">
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for jobs"
            className="w-full bg-white"
          />
          <Button onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Filters</h3>

          {/* Job Level Filter */}
          <div className="mb-4">
            <h4 className="text-xs mt-4 font-medium mb-1">Level</h4>
            <div className="flex flex-wrap space-x-1">
              {["Intern", "Junior", "Mid-level", "Senior", "Lead"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleJobLevelFilter(level)}
                  className={`text-xs py-1 px-3 border rounded-full mb-1 ${
                    jobLevel.includes(level) ? "bg-white-500 text-black" : "bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-4">
            <h4 className="text-xs font-medium mb-1">Location</h4>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full text-xs p-2 border rounded-md bg-white"
              disabled={isRemote} // Disable input when remote is selected
            />
          </div>

          {/* Remote Filter */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="remote-switch " className="mr-24">Remote Jobs</Label>
            <Switch id="remote-switch" checked={isRemote} onCheckedChange={setIsRemote} />
          </div>

          {/* Apply Filters Button */}
          <Button className="w-full mt-4" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Second Column: Jobs List (35% width) */}
      <div className="w-[35%] p-4 flex flex-col mt-6 bg-gray-50 space-y-4 border-r">
        <Card className="flex-grow overflow-hidden bg-gray-50">
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {jobs.length === 0 ? (
                <p className="text-center text-gray-500">No Jobs under selected filter</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card
                      key={job._id}
                      className={`cursor-pointer ${
                        selectedJob?._id === job._id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{job.jobName}</h3>
                        <p className="text-sm text-gray-500">{job.recruiterEmail}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Third Column: Job Details (45% width) */}
      {selectedJob && (
  <div className="w-[45%] mt-6 bg-gray-50 p-4">
    <Card className="h-full bg-gray-50  overflow-hidden">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div>
            <div className="flex items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedJob.jobName}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="mr-2" />
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" />
                <span>{selectedJob.jobSalary}</span>
              </div>
              <div className="flex items-center">
                <Eye className="mr-2" />
                <span>Posted on: {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'Date not specified'}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-2" />
                <span>{selectedJob.role}</span>
              </div>
            </div>
            <Button className="w-full mb-6" onClick={handleTakeTest}>
              Take Test
            </Button>
            <h3 className="text-xl font-semibold mb-2">Job Description:</h3>
            <p className="mb-4">{selectedJob.jobDescription}</p>
            <h3 className="text-xl font-semibold mb-2">Skills Required:</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedJob.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mb-1">Benefits:</h3>
            <p className="mb-1">{selectedJob.benefits || 'Benefits not specified'}</p>
            <h3 className="text-xl font-semibold mb-2">Experience Needed:</h3>
            <p>{selectedJob.experience || 'Experience level not specified'} years</p>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
)}



      {/* Google Sign In Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Google</DialogTitle>
            <DialogDescription>Enter your name to proceed with Google sign-in.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
            />
            <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
