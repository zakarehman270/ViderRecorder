import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { AuthProvider } from "./Context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <Toaster position="top-right" />
      <App />
    </AuthProvider>
  </Provider>
);
