import React, { useState } from 'react';
import { Power } from 'react-feather'; // Feather Icons
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Adjust the import path as needed
import { useAppStore } from '../../store/index'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PowerButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { SeekerInfo, setSeekerInfo, setRoles } = useAppStore((state) => ({
    SeekerInfo: state.SeekerInfo,
    setSeekerInfo: state.setSeekerInfo,
    setRoles: state.setRoles,
  }));

  const handleClick = () => {
    // Open the dialog
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    // Set seekerInfo to null, clear roles, close the dialog, and redirect to /resume
    setSeekerInfo({ tokenID: null, name: null });
    setRoles([]); // Clear roles
    setIsDialogOpen(false);
    const currentPath = window.location.pathname;

    // Check if the current path does not include '/recruit'
    if (!currentPath.includes('/recruit')) {
      // Redirect to /resume
      navigate('/resume', { replace: true });
      window.location.reload();

    }
  };

  const handleCancel = () => {
    // Close the dialog without logging out
    setIsDialogOpen(false);
  };

  // Only show the button if SeekerInfo.tokenID and SeekerInfo.name are not null
  if (!SeekerInfo || !SeekerInfo.tokenID || !SeekerInfo.name) {
    return null; // Hide the button if tokenID or name is not set
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-4 ml-3 mb-3 left-4 p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 transition duration-300"
      >
        <Power className="text-black w-4 h-4" />
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

export default PowerButton;
