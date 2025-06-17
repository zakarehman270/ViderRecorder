
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("AuthUser"));
  if (!storedUser) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,  
};

export default ProtectedRoute;
