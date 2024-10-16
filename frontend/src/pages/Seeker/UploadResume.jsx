import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppStore } from "../../store/index";
import { FiSearch as SearchIcon } from "react-icons/fi";
import GoogleLoginDialog from '../primarycomp/GoogleLoginDialog'; // Import GoogleLoginDialog

function UserDashboard() {
  const [result, setResult] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGDialogOpen, setIsGDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Access roles, SeekerInfo, and Zustand functions from the store
  const { roles, setRoles, setSelectedRole, SeekerInfo } = useAppStore((state) => ({
    roles: state.roles,
    setRoles: state.setRoles,
    setSelectedRole: state.setSelectedRole,
    SeekerInfo: state.SeekerInfo
  }));

  useEffect(() => {
    if (SeekerInfo && SeekerInfo.tokenID) {
      setIsSignedIn(true);
    }
  }, [SeekerInfo]);

  // Set roles in Zustand when response comes
  useEffect(() => {
    if (result.length > 0) {
      setRoles(result); // Update roles in Zustand
    }
  }, [result, setRoles]);

  const handleRoleClick = (role) => {
    setSelectedRole(role); // Update the selected role in Zustand
    navigate("/jobs"); // Navigate to the /jobs page
  };

  const handleSearchClick = () => {
    if (!isSignedIn) {
      setIsGDialogOpen(true); // Open the sign-in dialog if not signed in
      return;
    }
    if (searchTerm.trim()) {
      setSelectedRole(searchTerm); // Set the search term as the selected role
      navigate("/jobs"); // Navigate to the jobs page
      setIsGDialogOpen(false); // Close the dialog after navigating
    }
  };

  // Only display roles if SeekerInfo is set and valid
  const shouldDisplayRoles = SeekerInfo && SeekerInfo.tokenID && SeekerInfo.name;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      <header className="w-full max-w-3xl mx-auto text-center">
        {/* Apply Global Font Family */}
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap');

              * {
                font-family: 'Karla', sans-serif;
              }

              h1, p, button, input {
                font-family: 'Overpass', sans-serif;
              }
            `}
          </style>
        
        <h1 className="text-4xl mt-44 font-bold tracking-tighter sm:text-5xl animate__animated animate__fadeInDown mb-4">
          Upload your existing resume
        </h1>
        <h1 className="text-lg text-gray-600 mt-8">
          Browse the job listings, but note that a mock test is necessary for a referral or application.
        </h1>

        <div className="text-lg text-gray-600 mt-1">
          <span>After you click submit, </span>
          <span className="font-bold">wait a few seconds </span>
          <span>for resume analysis in toast.</span>
        </div>

        <div className="flex items-center justify-center mt-8">
          <div className="w-40 mr-56  h-20">
            <FileUploader setResult={setResult} />
          </div>
        </div>

        {/* Conditionally render roles based on SeekerInfo */}
        {shouldDisplayRoles && roles.length > 0 && (
          <div className="mt-60 ml-4">
            <p className="text-lg text-gray-600 mt-8">Choose a suitable role</p>
            <div className="mt-4 flex flex-col items-center">
              {roles.map((role, index) => (
                <Button
                  key={index}
                  onClick={() => handleRoleClick(role)}
                  size={"lg"}
                  className="mx-2 my-1 px-4 py-2 rounded-lg"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      <GoogleLoginDialog isDialogOpen={isGDialogOpen} setIsDialogOpen={setIsGDialogOpen} /> {/* Ensure this dialog receives and uses the state properly */}

      {/* Search Icon at Bottom Right Corner */}
      <div className="fixed bottom-4 right-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-gray-700  animate-bounce text-white rounded-full p-3 hover:bg-gray-800"
              onClick={() => setIsDialogOpen(true)}
            >
              <SearchIcon size={24} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Search Jobs Manually</DialogTitle>            
            </DialogHeader>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter job title or keywords..."
                className="border rounded-lg p-2 w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default UserDashboard;
