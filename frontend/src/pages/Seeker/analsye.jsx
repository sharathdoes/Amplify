import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

function AnalyzeAnswer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const analysis = state?.analysis || "No analysis provided.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Skill Gap Analysis</h1>
        <div className="mb-6">
          <ReactMarkdown className="prose prose-lg text-gray-700">{analysis}</ReactMarkdown>
        </div>
        {/* <Button onClick={() => navigate('/jobs')} className="w-full">
          Go Back
        </Button> */}
      </div>
    </div>
  ); 
}

export default AnalyzeAnswer;
