import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container-shell flex min-h-[60vh] items-center justify-center">
        <div className="card-surface px-6 py-5 text-sm font-semibold text-slate-600">
          Loading your SchoolHub account...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

