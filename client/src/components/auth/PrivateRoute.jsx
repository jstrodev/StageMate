import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user?.id);

  console.log("Auth state:", { token, user, isAuthenticated });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
