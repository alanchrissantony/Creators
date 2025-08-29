import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useAdmin = () => {
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
  const isAuthenticated = !!admin?.email;
  return { admin, isAuthenticated };
};