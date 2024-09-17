import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Briefcase, Calendar, MapPin } from 'lucide-react';
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function JobDashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const companyName = userInfo.companyName;
  const tokenId = userInfo.tokenId;
 console.log(tokenId);
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(`http://localhost:6546/api/jobsbytokenid?tokenId=${tokenId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setJobPostings(data);
        } else {
          setJobPostings([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setJobPostings([]);
      }
    }

    fetchJobs();
  }, [tokenId]);

  const handleUpdate = async () => {
    if (!selectedJob) return;

    // Navigate to the job input page with the job ID as a parameter
    navigate(`/Jobinput?jodId=${selectedJob._id}`);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
  
    try {
      // Perform a soft delete using a PATCH request
      await axios.post(`http://localhost:6546/api/jobs/${selectedJob._id}/soft-delete`);
      
      // Refresh job postings after deletion
      setJobPostings(prevJobs => prevJobs.filter(job => job._id !== selectedJob._id));
      setSelectedJob(null);
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Failed to delete job", error);
      alert("Error deleting job");
    }
  };
  
  return (
    <div className="container pt-36 mx-auto p-6 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Hi, {companyName}!</h1>
        <p className="text-xl text-muted-foreground">Here are your previous job postings</p>
      </header>

      <Button onClick={() => navigate('/Jobinput')} className="mb-6 w-full" size="lg">
        <PlusCircle className="mr-2 h-5 w-5" /> New Job Opening
      </Button>

      {jobPostings.length === 0 ? (
        <p className="text-center text-muted-foreground">No job postings available. Please create a new job opening.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobPostings.map((job) => (
            <Card key={job._id} className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer" onClick={() => setSelectedJob(job)}>
              <CardHeader className="bg-primary/10 pb-4">
                <CardTitle className="text-lg font-semibold line-clamp-1">{job.jobName}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <Briefcase className="mr-1 h-4 w-4" />
                  {job.recruiterEmail}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="mr-1 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={selectedJob !== null} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedJob?.jobName}</DialogTitle>
            <DialogDescription>{selectedJob?.recruiterEmail}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-2 max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                {selectedJob?.location}
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedJob && new Date(selectedJob.createdAt).toLocaleDateString()}
              </div>
              <p className="text-sm leading-relaxed">{selectedJob?.jobDescription}</p>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleUpdate} className="mr-2">Update</Button>
            <Button onClick={handleDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
