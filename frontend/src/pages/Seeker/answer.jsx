import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { toast, Toaster } from 'sonner'; // Import toast and Toaster from sonner

export default function Component() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.analysis) {
      setAnalysis(state.analysis);
    }
  }, [state]);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const hello = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file);

      // Upload the resume and extract the text
      const uploadResponse = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const extractedText = uploadResponse.data.extracted_text;
      setResumeText(extractedText); // Set resume text

      // Send the extracted resume text to Google's Generative Language API for skill gap analysis
      const analysisResponse = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAp-XHDUyaRo_qH9LLowS_kKdY25p7-JSY',
        {
          contents: [
            {
              parts: [
                {
                  text: `This is the user's resume, and his details: ${extractedText}. Provide skill gap analysis, what he lacks, and suggestions he has to implement for better job opportunities.`
                }
              ]
            }
          ]
        }
      );

      console.log('Analysis response:', analysisResponse.data);
      const analysisText = analysisResponse.data.candidates[0].content.parts[0].text || "No analysis generated";
      setAnalysis(analysisText); // Set the analysis result

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Show toast notification
    toast('Submitting resume for analysis, please wait...'); 
    
    hello(); // Trigger the hello function on submit
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
      <Toaster /> {/* Add Toaster component to render toasts */}
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Skill Gap Analysis</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {file ? file.name : "Click to upload or drag and drop your resume here"}
              </label>
            </div>
          </div>
          <Button type="submit" disabled={!file} className="w-full">Submit for Analysis</Button>
          <div className="text-lg text-gray-600 mt-4 text-center">
            <span>After you click submit, </span>
            <span className="font-bold">wait a few seconds </span>
            <span>for resume analysis.</span>
          </div>
        </form>

        {analysis && (
          <div className="bg-white shadow-md rounded-lg p-6 text-left mt-6">
            <h2 className="text-xl font-semibold mb-4 pb-6 text-center">Analysis Results</h2>
            <ReactMarkdown className="prose prose-lg text-gray-700">
              {analysis}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
