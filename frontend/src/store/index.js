import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Authentication Slice
const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => {
    set({ userInfo });
    // Start timer to clear data after 3 days
    setTimeout(() => {
      set({ userInfo: undefined });
    }, 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
  },
});

// Seek Slice
const createSeekSlice = (set) => ({
  SeekerInfo: undefined,
  setSeekerInfo: (SeekerInfo) => {
    set({ SeekerInfo });
    // Start timer to clear data after 3 days
    setTimeout(() => {
      set({ SeekerInfo: undefined });
    }, 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
  },
});

// Job Info Slice
const createJobInfoSlice = (set) => ({
  selectedRole: '',
  setSelectedRole: (role) => set({ selectedRole: role }),
});

// Roles Slice (merged setRoles and setSelectedRole here for consistency)
const createRolesSlice = (set) => ({
  roles: [], // Initialize with an empty array
  setRoles: (roles) => set({ roles }),
});

// LeetCode Slice
const createLeetCodeSlice = (set) => ({
  leetOpen: false, // Default to false
  setLeetOpen: (isOpen) => set({ leetOpen: isOpen }),
});

// RapidApiJobs Slice
const createRapidApiJobsSlice = (set) => ({
  rapidApiJobs: [], // Initialize with an empty array
  setRapidApiJobs: (jobs) => set({ rapidApiJobs: jobs }),
});

// Combine Slices into a Single Store
export const useAppStore = create(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createJobInfoSlice(set, get),
      ...createSeekSlice(set, get),
      ...createRolesSlice(set, get), // Fixed name for roles slice
      ...createLeetCodeSlice(set, get),
      ...createRapidApiJobsSlice(set, get), // Add RapidApiJobs slice
    }),
    {
      name: 'app-store', // Unique name for storage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);
