import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // Import Sonner's toast function
import { useAppStore } from "../../store/index";
import { useNavigate } from 'react-router-dom';
import GoogleLoginDialog from '../primarycomp/GoogleLoginDialog'; // Import GoogleLoginDialog

function FileUploader({ setResult }) {
  const [file, setFile] = useState(null);
  const [userTokenID, setUserTokenID] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const SeekerInfo = useAppStore((state) => state.SeekerInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (SeekerInfo && SeekerInfo.tokenID) {
      setUserTokenID(SeekerInfo.tokenID);
      setIsSignedIn(true);
    }
  }, [SeekerInfo]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }
    if (!isSignedIn) {
      setIsDialogOpen(true); // Open the sign-in dialog if not signed in
      return;
    }

    toast.success('Wait a few sec...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(uploadResponse.data.roles);
      console.log("text we found is :")
      console.log(uploadResponse.data.extracted_text);

      const resumeText = uploadResponse.data.extracted_text;
      const analysisResponse = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAp-XHDUyaRo_qH9LLowS_kKdY25p7-JSY',
        {
          contents: [
            {
              parts: [
                { text: `This is the user's resume... and his details: ${resumeText}. Provide skill gap analysis, what he lacks, and suggestions he has to implement for better job opportunities.` }
              ]
            }
          ]
        }
      );

      const analysis = analysisResponse.data.candidates[0].content.parts[0].text || "No analysis generated";
      console.log('Analysis text:',resumeText);
      console.log('Analysis response:', analysisResponse.data);
      // Display the toast notification with a button to view the analysis
      toast.custom((t) => (
        <div
          className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        >
          <div className="p-4 flex items-center justify-between w-full">
            <div className="text-gray-900 font-semibold">Resume Analysis</div>
            <Button
              onClick={() => {
                navigate('/anal', { state: { analysis } });
                t.onClick();
              }}
              className="ml-4 bg-black text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Analysis
            </Button>
          </div>
        </div>
      ), { duration: 5000 });

    } catch (error) {
      console.error("Error uploading the file or analyzing resume:", error.response?.data || error.message);
    }
  };

  return (
    <div className="w-[400px] h-[300px] max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div
            className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('dropzone-file').click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
            </div>
            <Input id="dropzone-file" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </div>
          <p className="text-gray-600 text-center">File: {file ? file.name : 'No file chosen'}</p>
        </div>
        <Button onClick={handleUpload} className="w-full bg-black text-white">
          Submit Application
        </Button>
      </div>

      {/* Sign-In Dialog */}
      <GoogleLoginDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}

export default FileUploader;
