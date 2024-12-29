import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/" />;
  }

  try {
    // Decode token to get user role
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    // Check if the user has the required role for the route
    if (userRole !== requiredRole) {
      // If the role doesn't match, redirect to an "Unauthorized" page or back to the dashboard
      return <Navigate to={`/${userRole.toLowerCase()}`} />;
    }

    // If the role matches, render the component
    return children;
  } catch (error) {
    // If token is invalid or decoding fails, redirect to login
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
