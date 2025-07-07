import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("🚀 ~ useAuth ~ context:", context)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
