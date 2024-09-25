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
      const uploadResponse = await axios.post('https://amplify-5.onrender.com/analyze', formData, {
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 justify-center pt-24">
      <Toaster /> {/* Add Toaster component to render toasts */}
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Karla:wght@200..800&display=swap');

          body {
            font-family: 'Karla', sans-serif;
          }

          h1, p, label {
            font-family: 'Karla', sans-serif;
          }
        `}
      </style>

      <div className="w-full max-w-2xl bg-gray-50 shadow-lg border pt-8 mb-12 rounded-xl p-8 py-2 text-center">
        <h1 className="text-3xl font-bold mb-6">Skill Gap Analysis</h1>
        
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:border-gray-500 transition-colors hover:shadow-lg bg-gray-50">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="resume-upload" className="cursor-pointer text-gray-600 text-lg">
                {file ? file.name : "Click to upload or drag and drop your resume here"}
              </label>
            </div>
          </div>
          <Button type="submit" disabled={!file} className="w-full text-white py-3 rounded-lg transition-colors">
            Submit for Analysis
          </Button>
        </form>

   

        {analysis && (
          <div className="bg-gray-50 shadow-md rounded-lg mb-6 p-6 text-left mt-6">
            <h2 className="text-xl font-semibold mb-4 pb-4 text-center ">Analysis Results</h2>
            <ReactMarkdown className="prose prose-lg text-gray-700">
              {analysis}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
