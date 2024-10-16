import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store"; // Use your app store

const JobSearch = () => {
  const { rapidApiJobs, setRapidApiJobs } = useAppStore(); // Access the state from the store

  const fetchJobs = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "jobs-search-api.p.rapidapi.com",
        "x-rapidapi-key": "5e6758784fmshd4cc117c6a9349bp1b2c02jsnc288163ef483",
      },
      body: JSON.stringify({
        search_term: "web",
        location: "mumbai",
        results_wanted: 10,
        site_name: ["indeed", "linkedin", "zip_recruiter", "glassdoor"],
        distance: 50,
        job_type: "fulltime",
        is_remote: false,
        linkedin_fetch_description: false,
        hours_old: 72,
      }),
    };

    try {
      const response = await fetch(
        "https://jobs-search-api.p.rapidapi.com/getjobs",
        options
      );
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      if (data.jobs && data.jobs.length > 0) {
        setRapidApiJobs(data.jobs); // Update the Zustand store only if jobs are found
      } else {
        console.warn("No jobs found in the API response."); // Log to warn about no jobs found
      }
    } catch (err) {
      console.error(err.message);
      // Optionally, you can retry fetching jobs or keep the previous jobs in case of an error.
    }
  };

  // Automatically fetch jobs every day
  useEffect(() => {
    fetchJobs(); // Initial call
    const intervalId = setInterval(fetchJobs, 24 * 60 * 60 * 1000); // Call every day

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Job Listings in Mumbai</h2>

      <Button onClick={fetchJobs} className="mb-4">
        {rapidApiJobs.length > 0 ? "Refresh Jobs" : "Fetch Jobs"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rapidApiJobs.length > 0 ? (
          rapidApiJobs.map((job, index) => (
            <Card key={index} className="hover:shadow-lg cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{job.company_name}</p>
                <p className="text-sm text-gray-600">{job.location}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No jobs found. Please check back later!</p>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
