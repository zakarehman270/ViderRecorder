import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app initialization, check for user data in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("AuthUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Restore user data from localStorage
    }
  }, []);


  const login = (userData) => {
    setUser(userData); // Update state
    localStorage.setItem("AuthUser", JSON.stringify(userData)); // Save to localStorage
  };

  const logout = () => {
    setUser(null); // Clear state
    localStorage.removeItem("AuthUser"); // Remove from localStorage
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useAuth = () => useContext(AuthContext);
