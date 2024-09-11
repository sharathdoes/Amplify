import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Authentication Slice
export const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
export const createSeekSlice = (set) => ({
  SeekerInfo: undefined,
  setSeekerInfo: (SeekerInfo) => set({ SeekerInfo }),
});

// Job Info Slice
export const createJobInfoSlice = (set) => ({
  selectedRole: '',
  setSelectedRole: (role) => set({ selectedRole: role }),
});
export const Rolesslice = ((set) => ({
  roles: [], // Initialize with an empty array
  setRoles: (roles) => set(() => ({ roles })),
  setSelectedRole: (role) => set(() => ({ selectedRole: role })),
}));

// Combine Slices into a Single Store
export const useAppStore = create(
  persist(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createJobInfoSlice(set, get, api),
      ...createSeekSlice(set, get, api),
      ...Rolesslice(set, get, api),
    }),
    {
      name: 'app-store', // Unique name for storage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);
