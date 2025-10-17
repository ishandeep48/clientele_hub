import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// route to check if the person is logged in and authorised before opening the protected site
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (!decoded.exp || decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/admin/login" />;
    }
    // Check for admin role
    if (!decoded.role || decoded.role != "admin") {
      localStorage.removeItem("token");
      return <Navigate to="/admin/login" />;
    }
  } catch (e) {
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" />;
  }
  return children;
}
