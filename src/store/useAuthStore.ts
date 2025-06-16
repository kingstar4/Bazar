// import {create} from 'zustand';
// import auth from '@react-native-firebase/auth';

// interface AuthState {
//   isAuthenticated: boolean;
//   initializing: boolean;
//   userEmail: string | null;
//   userId: string | null;
//   userDisplayName: string | null;
//   setAuthenticated: (value: boolean) => void;
//   setInitializing: (value: boolean) => void;
//   setUserDetails: (email: string | null, id: string | null, displayName: string | null) => void;
//   logout: () => Promise<void>;
//   initialize: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   initializing: true,
//   userEmail: null,
//   userId: null,
//   userDisplayName: null,
//   setAuthenticated: (value) => set({ isAuthenticated: value }),
//   setInitializing: (value) => set({ initializing: value }),
//   setUserDetails: (email, id, displayName) =>
//     set({ userEmail: email, userId: id, userDisplayName: displayName }),
//   logout: async () => {
//     try {
//       await auth().signOut();
//       set({ isAuthenticated: false, userEmail: null, userId: null, userDisplayName: null });
//     } catch (error) {
//       console.error('Logout Error:', error);
//       throw error;
//     }
//   },
//   initialize: () => {
//     const unsubscribe = auth().onAuthStateChanged((user) => {
//       set({
//         isAuthenticated: !!user,
//         userEmail: user?.email || null,
//         userId: user?.uid || null,
//         userDisplayName: user?.displayName || null,
//         initializing: false,
//       });
//     });
//     return () => unsubscribe();
//   },
// }));