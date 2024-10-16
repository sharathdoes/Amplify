import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useAppStore } from "@/store";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog"; // Updated import
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import { apiClient } from "@/lib/apiClient";

export default function Exam() {
  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(20); // 20 seconds per question
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [canMoveBack, setCanMoveBack] = useState(true);
  const [isAnomalyDetected, setIsAnomalyDetected] = useState(false);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [showDialog, setShowDialog] = useState(false); 
  const [anomalyDialog, setAnomalyDialog] = useState(false);
 // For anomaly detection dialog
  // State for alert visibility

  const jobId = new URLSearchParams(window.location.search).get("jobId");
  const { SeekerInfo } = useAppStore();
 const navigate=useNavigate();
 useEffect(() => {
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && hasStarted) {
      setIsAnomalyDetected(true);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden && hasStarted) {
      setIsAnomalyDetected(true);
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [hasStarted]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get(`/api/jobs/${jobId}`); 
        console.log(response)
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data =  response.data;

        if (data.questions && data.questions.length > 60) {
          // Randomly select 10 questions and set them in the job object
          data.questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 10);
        }
        setJob(data);
        
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch job", error);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  useEffect(() => {
    const checkTestStatus = async () => {
      try {
        const response = await apiClient.post('/api/didhe', { // Adjusted to remove '/api' from the path if your baseURL includes it
          tokenID: SeekerInfo.tokenID,
          jobId,
        });
      

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Network response was not ok: ${response.status}`);
        } 
        const data = await response.data;
        setHasTakenTest(data.hasTakenTest);
      } catch (error) {
        console.error("Failed to check test status", error);
      }
    };

    checkTestStatus();
  }, [SeekerInfo.tokenID, jobId]);

  useEffect(() => {
    if (hasStarted && !isSubmitted) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleNextQuestion();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hasStarted, currentQuestionIndex, isSubmitted]);

  const handleAnswerChange = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (job?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(20); // Reset timer for the next question
      setCanMoveBack(false); // Disable moving back once moved forward
    } else {
      handleSubmit(); // Auto-submit if it's the last question
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    if (isAnomalyDetected) {
      setAnomalyDialog(true);

      try {
        const response = await apiClient.post('/api/tookTest', { 
          tokenID: SeekerInfo.tokenID,
          jobId,
        });
        if (!response.ok) {
          throw new Error("Failed to update test status");
        }
      } catch (error) {
        console.error("Failed to update test status", error);
      }
      toast("An anomaly was detected during the test.");
      return;
    }
    if (job && job.questions) {
      const correctAnswers = job.questions.reduce((acc, question, index) => {
        return question.correctOption === answers[index] ? acc + 1 : acc;
      }, 0);
      setScore(correctAnswers);
      setIsSubmitted(true);
      
       // Exit fullscreen automatically
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

      try {
        const response = await apiClient.post('/api/tookTest', { 
          tokenID: SeekerInfo.tokenID,
          jobId,
        });

        if (!response.ok) {
          throw new Error("Failed to update test status");
        }
      } catch (error) {
        console.error("Failed to update test status", error);
      }
    }
  };

  const startTest = () => {
    if (hasTakenTest) {
      setShowDialog(true); // Show the alert if the test has already been taken
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toast("Don't undo fullscreen, we're watching!");
    }

    setHasStarted(true);
  };

  const renderButton = () => {
    if (score === null || !job) return null;

    if (score >= job.referral) {
      const mailtoLink = `mailto:${job.subRecruiterEmail}?subject=Referral Request for ${job.jobName}`;

      return (
        <div className="flex justify-center mt-6">
          <Button
            className="bg-black text-white hover:bg-blue-600"
            onClick={() => (window.location.href = mailtoLink)}
          >
            Send Resume via Email
          </Button>
        </div>
      );
    } else if (score >= job.applicable) {
      return (
        <div className="flex justify-center mt-6">
          <Button
            className="text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => window.open(job.applyLink, "_blank")}
          >
            Apply Now
          </Button>
        </div>
      );
    } else {
      return <h1 className="text-center text-red-500">Sorry!!! You're not eligible</h1>;
    }
  };

  const currentQuestion = job?.questions[currentQuestionIndex];

  if (error) return <p>Error: {error}</p>;
  if (!job) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center bg-gray-50 justify-center h-screen bg-background p-6 sm:p-8 md:p-10">
      {showDialog && (
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>Test Already Taken</DialogTitle>
          <DialogContent>
            <p>You have already taken this test.</p>
            <div className="flex justify-center mt-4">
              <Button
                onClick={()=>navigate('/jobs')}
                className="text-white bg-primary hover:bg-primary/90"
              >
                Go Back
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {anomalyDialog && (
        <Dialog open={anomalyDialog} onClose={() => setAnomalyDialog(false)}>
          <DialogTitle>Anomaly Detected</DialogTitle>
          <DialogContent>
            <p>You performed an anomaly during the test.</p>
            <div className="flex justify-center mt-4">
              <Button
                className="text-white bg-red-500 hover:bg-red-600"
                onClick={() => navigate("/jobs")}
              >
                Go Back to Jobs
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}  
      {!hasStarted ? (
        <Card className="w-full max-w-3xl mt-36 p-8 mb-28 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">{job.jobName} Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-lg">
              Welcome to the official exam for the {job.jobName} position. Please read the
              instructions carefully before starting the test.
            </p>
            <ul className="list-disc list-inside mb-4 text-lg">
              <li>You will have 20 seconds to answer each question.</li>
              <li>You can only write once, tab switches, undo fullscreen will be detected.</li>
              <li>Your score will determine your eligibility for the job/referral.</li>
            </ul>
            <div className="flex justify-center">
              <Button
                className="text-white bg-primary hover:bg-primary/90"
                onClick={startTest}
              >
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full mt-24  max-w-3xl p-8 mb-28 rounded-lg shadow-lg">
          <CardHeader className="mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {}}
                disabled={!canMoveBack || isSubmitted}
              >
                Previous
              </Button>
              <div className="text-2xl text-card-foreground">
                <Button id="timer" variant="outline" size="sm" className="text-muted-foreground mr-8">
                  {timer} sec left
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === (job.questions.length - 1) || isSubmitted}
              >
                Next
              </Button>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-card-foreground">
              Question {currentQuestionIndex + 1} of {job.questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-2">{currentQuestion?.question}</h2>
              <div className="space-y-2">
                <RadioGroup>
                  {currentQuestion?.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={option}
                        onChange={() => handleAnswerChange(option)}
                        checked={answers[currentQuestionIndex] === option}
                        disabled={isSubmitted}
                      />
                      <label className="ml-2">{option}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            {currentQuestionIndex === job.questions.length - 1 && (
              <Button
                className="text-white bg-primary hover:bg-primary/90 mt-4"
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                Submit
              </Button>
            )}
            {score !== null && isSubmitted && (
              <p className="mt-4 text-center">Your score: {score} / {job.questions.length}</p>
            )}
            {isSubmitted && renderButton()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
