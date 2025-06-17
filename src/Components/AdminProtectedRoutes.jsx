import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
const AdminProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse( localStorage.getItem("AuthUser") );
  if (!storedUser) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }
  return children;
};
AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AdminProtectedRoute;
