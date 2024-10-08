import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../../store/index";

function UserDashboard() {
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  // Access roles, SeekerInfo, and Zustand functions from the store
  const { roles, setRoles, setSelectedRole, SeekerInfo } = useAppStore((state) => ({
    roles: state.roles,
    setRoles: state.setRoles,
    setSelectedRole: state.setSelectedRole,
    SeekerInfo: state.SeekerInfo
  }));

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

  // Only display roles if SeekerInfo is set and valid
  const shouldDisplayRoles = SeekerInfo && SeekerInfo.tokenID && SeekerInfo.name;

  return (
    <div className="flex min-h-screen  flex-col items-center bg-gray-50 ">
      <header className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl mt-44 font-bold tracking-tighter sm:text-5xl animate__animated animate__fadeInDown mb-4">
          Upload your existing resume
        </h1>
        <h1 className="text-lg text-gray-600 mt-8">
          Browse the job listings, but note that a mock test is necessary for either a referral or application.
        </h1>

        <div className="text-lg text-gray-600 mt-1">
          <span>After you click submit, </span>
          <span className="font-bold">wait a few seconds </span>
          <span>for resume analysis in toast.</span>
        </div>

        <div className="flex items-center justify-center mt-8">
          <FileUploader setResult={setResult} />
        </div>

        {/* Conditionally render roles based on SeekerInfo */}
        {shouldDisplayRoles && roles.length > 0 && (
          <div className="mt-8">
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
    </div>
  );
}

export default UserDashboard;
