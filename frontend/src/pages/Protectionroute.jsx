import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/index'; // Import your zustand store

const ProtectedRoute = ({ element, seekerOnly, recruiterOnly }) => {
  const { SeekerInfo, userInfo } = useAppStore();

  // If it's a seeker-only route and seeker info is not set, block access
  if (seekerOnly && !SeekerInfo.tokenID) {
    console.log('nahh')
    return <div className='text-black'>You can't access this page until you log in as a seeker.</div>;
  }

  // If it's a recruiter-only route and user info is not set, block access
  if (recruiterOnly && !userInfo.tokenId) {
    return <div className='text-black'>You can't access this page until you log in as a recruiter.</div>;
  }

  // If both SeekerInfo and userInfo are not set for routes that require either, block access
  if (!SeekerInfo.tokenID && !userInfo.tokenId) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
