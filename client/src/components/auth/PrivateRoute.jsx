import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  console.log("Auth state in PrivateRoute:", auth);

  if (!auth.token || !auth.user?.id) {
    console.log("Redirecting to auth - missing credentials");
    return <Navigate to="/auth" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
