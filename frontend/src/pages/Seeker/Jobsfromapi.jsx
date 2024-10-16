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
        location: "hyderabad",
        results_wanted: 30,
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
        console.error("Failed to fetch jobs, retaining old ones.");
        return; // Keep existing jobs if the request fails
      }
      const data = await response.json();
      if (data.jobs && data.jobs.length > 0) {
        setRapidApiJobs(data.jobs); // Only update jobs if new data is available
      } else {
        console.warn("No new jobs found, retaining old ones.");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
    }
  };

  // Automatically fetch jobs every day
  useEffect(() => {
    fetchJobs(); // Initial call to fetch jobs

    const intervalId = setInterval(fetchJobs, 60 * 1000); // Fetch jobs every 24 hours

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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
          <p>Loading jobs, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
