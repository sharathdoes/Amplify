import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppStore } from "../../store/index";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import Sonner's toast function

// Import Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

function FileUploader({ setResult }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [userTokenID, setUserTokenID] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setSeekerInfo = useAppStore((state) => state.setSeekerInfo);
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
    console.log('File selected:', event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    console.log('File dropped:', event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    if (SeekerInfo.tokenID) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', file);

        const uploadResponse = await axios.post('http://localhost:5000/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Upload response:', uploadResponse.data);
        setResult(uploadResponse.data.roles);

        const resumeText = uploadResponse.data.extracted_text;
        console.log("hi")
        console.log(resumeText);

        // Send the resume text to Gemini for analysis
        const analysisResponse = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAp-XHDUyaRo_qH9LLowS_kKdY25p7-JSY',
          {
            contents: [
              {
                parts: [
                  {
                    text: `This is the user's resume, and his details: ${resumeText}. Provide skill gap analysis, what he lacks, and suggestions he has to implement for better job opportunities.`
                  }
                ]
              }
            ]
          }
        );

        console.log('Analysis response:', analysisResponse.data);
        const analysis = analysisResponse.data.candidates[0].content.parts[0].text || "No analysis generated";
        
        // Display the toast notification
        toast.custom((t) => (
          <div
          className={`toast ${t.visible ? 'animate-enter' : 'animate-leave'} 
          p-2 bg-white text-black flex items-center justify-between rounded-lg shadow-md
          w-80 h-15`}
        >
          <div className="font-bold  text-gray-700 ml-8 text-center ">
            Resume analysis
          </div>
          <Button
            onClick={() => {
              navigate('/anal', { state: { analysis } });
              t.onClick(); // Ensure the toast hides when the button is clicked
            }}
            className="ml-2 bg-black text-white hover:bg-gray-800 text-xs"
          >
            View Analysis
          </Button>
        </div>
        ), {
          duration: 5000 // Adjust the duration as needed
        });

      } catch (error) {
        console.error("Error uploading the file or analyzing resume:", error.response?.data || error.message);
      }
    } else {
      setIsDialogOpen(true);
    }
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
      console.log("User Info:", userInfo);

      const userId = userInfo.sub;
      console.log("User ID:", userId);

      console.log("user Name:", name);

      const response = await axios.post("http://localhost:6546/api/UserSignin", { tokenID: userId, name: name });

      if (response.status === 201) {
        setSeekerInfo(response.data.user);
        setIsSignedIn(true);
        setIsDialogOpen(false); // Close the dialog after successful sign-in

        // Ensure dialog closes by forcing state update
       
      }
    } catch (error) {
      console.error("Error signing in or uploading the file:", error.response?.data || error.message);
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
      toast.error("Please enter a name before signing in.");
      return;
    }
    signIn();
    console.log("Google Sign-In clicked");
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
        <Button
          onClick={handleUpload}
          className={`w-full ${isSignedIn ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-200 '} transition-colors duration-300`}
        >
          Submit Application
        </Button>
      </div>

      {/* Sign-In Dialog */}
      <Dialog  className="bg-gray-50" open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In to Continue</DialogTitle>
            <DialogDescription>Please enter your name and sign in with Google to proceed with the upload.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <Button className="w-full" onClick={handleGoogleSignIn}>
              Sign in with Google
            </Button>
          </div>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FileUploader;