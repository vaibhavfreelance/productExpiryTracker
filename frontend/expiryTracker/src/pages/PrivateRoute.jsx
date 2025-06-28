import PropTypes from "prop-types"; // ✅ Add this
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
}

// ✅ Add this to fix the error
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
