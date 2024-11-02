import { Navigate, useLocation } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
  const token = localStorage.getItem('jwttoken');
  const userType = localStorage.getItem('userType');
  const location = useLocation();

  // If user is not logged in and trying to access protected routes
  if (!token) {
    // Redirect to login, but don't include login/register paths in the history
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      return <Navigate to="/login" replace />;
    }
  }

  // If user is logged in and trying to access auth pages (login/register)
  if (token && (location.pathname === '/login' || location.pathname === '/register')) {
    const redirectPath = userType === "Pharma" ? '/pharmacy-dashboard' : '/pharmacy-app';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};