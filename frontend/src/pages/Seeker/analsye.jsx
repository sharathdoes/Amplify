import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/store";
import "./this.css";

export function AnalyzeAnswer() {
  const { rapidApiJobs } = useAppStore();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
console.log(rapidApiJobs)
  const openDialog = (job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

  // Slicing the jobs list into two rows
  const firstRow = rapidApiJobs.slice(0, Math.ceil(rapidApiJobs.length / 2));
  const secondRow = rapidApiJobs.slice(Math.ceil(rapidApiJobs.length / 2));

  // ReviewCard component displaying job details
  const ReviewCard = ({ job }) => {
    const { title, company_name, company_url, company,job_url,company_addresses } = job;

    return (
      <figure
        onClick={() => openDialog(job)}
        className={cn(
          "relative w-[21.875rem] h-28 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
          "border-gray-950/[.1] bg-white hover:bg-gray-950/[.05]",
          "dark:border-gray-50/[.1] dark:bg-gray-50 dark:hover:bg-gray-50/[.15]"
        )}
      >
        <div className="flex items-center gap-3">
          <div>
            <figcaption className="text-sm font-medium dark:text-white">
              {title || "Title not available"}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">
              {company_name || company||"Company not provided"}
            </p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">
          {company_url || job_url|| "URL not available"}
        </blockquote>
        
      </figure>
    );
  };

  const useCircularQueue = (arr) => {
    const [queue, setQueue] = useState([...arr]);

    useEffect(() => {
      const interval = setInterval(() => {
        setQueue((prev) => [...prev.slice(1), prev[0]]);
      }, 3000); // Change every 3 seconds, adjust as needed
      return () => clearInterval(interval);
    }, []);

    return queue;
  };

  // Check for available jobs
  if (!rapidApiJobs || rapidApiJobs.length === 0) {
    return <p>No jobs found.</p>;
  }

  const firstRowQueue = useCircularQueue(firstRow);
  const secondRowQueue = useCircularQueue(secondRow);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg mt-36 bg-gray-50">
      {/* First row moving left to right */}
      <div className="marquee-reverse relative w-full overflow-hidden whitespace-nowrap flex mb-8">
        <div className="track flex flex-row w-max animate-marquee">
          {firstRowQueue.concat(firstRowQueue).map((job, index) => (
            <ReviewCard key={index} job={job} />
          ))}
        </div>
      </div>

       {/* Second row moving left to right, slightly behind */}
       <div className="marquee relative w-full overflow-hidden whitespace-nowrap flex mb-8">
       <div className="track flex flex-row w-max animate-marquee second-row">
          {secondRowQueue.concat(secondRowQueue).map((job, index) => (
            <ReviewCard key={index} job={job} />
          ))}
        </div>
      </div>
      
            {/* Gradient for visual effects */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l"></div>

      {/* Dialog */}
      {isDialogOpen && selectedJob && (
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedJob.title || "Job Details"}</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p><strong>Company:</strong> {selectedJob.company_name || "N/A"}</p>
              <p><strong>Location:</strong> {selectedJob.location || selectedJob.company_addresses ||"N/A"}</p>
              <p><strong>URL:</strong> <a href={selectedJob.company_url ||selectedJob.job_url|| "#"} target="_blank" rel="noopener noreferrer">{selectedJob.company_url || "N/A"}</a></p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AnalyzeAnswer;
