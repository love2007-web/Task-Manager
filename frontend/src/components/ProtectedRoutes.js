import { Route, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the access token is present in localStorage
    const accessToken = localStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  const renderComponentOrRedirect = (props) => {
    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      );
    }
  };

  return <Route {...rest} render={renderComponentOrRedirect} />;
};

export default ProtectedRoute;
