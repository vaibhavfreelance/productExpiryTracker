import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItemPage from "./pages/AddItemForm";
import AllItemsPage from "./pages/AllItemsPage";
import AuthUI from "./pages/Auth";
import NotificationManager from "./components/NotificationManager"; // ✅ added
import { AuthProvider, useAuth } from "./context/AuthContext";
import PropTypes from "prop-types";

// ✅ Private route logic
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ All routes with Navbar and Notification conditional
function AppRoutes() {
  const { token } = useAuth();

  return (
    <Router>
      {token && <Navbar />}
      {token && <NotificationManager />} {/* ✅ Notification handler */}
      <ToastContainer autoClose={1000} closeButton={false} />
      <Routes>
        <Route
          path="/auth"
          element={!token ? <AuthUI /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddItemPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <AllItemsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// ✅ App wrapped in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
