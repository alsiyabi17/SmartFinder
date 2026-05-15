import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false, blockAdmin = false }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.email === "admin@gmail.com";

  // Admin-only route: non-admins are bounced away
  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Customer-only route: admin is redirected to their dashboard
  if (blockAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;