import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import ResumeUI from "./pages/UserProfilePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./pages/Login";
import AdminPage from "./Admin/Admin";
import AdminProtectedRoute from "./Components/AdminProtectedRoutes";
import DashboardPage from "./Dashboard/Dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <IntroPage  />,
  },
  {
    path: "/profile/*",
    element: <ResumeUI  />,
  },
  {
    path: "/subprofile/*",
    element: <ResumeUI  />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute> ,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminProtectedRoute ><AdminPage /></AdminProtectedRoute> ,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
