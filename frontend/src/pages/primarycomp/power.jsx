import React, { useState } from 'react';
import { Power } from 'react-feather'; // Feather Icons
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Adjust the import path as needed
import { useAppStore } from '../../store'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RECPower = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  
  // Access user info and setter from Zustand store
  const { userInfo, setUserInfo } = useAppStore((state) => ({
    userInfo: state.userInfo,
    setUserInfo: state.setUserInfo,
  }));

  const handleClick = () => {
    // Open the dialog
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Set userInfo to null, close the dialog, and redirect to /resume
    setUserInfo(null);
    setIsDialogOpen(false);
    
    navigate('/recruit', { replace: true }); // Redirect to /resume
  };

  const handleCancel = () => {
    // Close the dialog without logging out
    setIsDialogOpen(false);
  };

  // Only show the button if userInfo is not null
  if (!userInfo) {
    return null; // Hide the button if userInfo is not set
  }

  return (
    <>
    
      <button onClick={handleClick} className="p-1  mr-72 rounded-md flex items-center">
                <Power className="w-4 h-4 " />
              </button>
      {/* Dialog for logout confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>Are you sure you want to log out?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={handleConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RECPower;
