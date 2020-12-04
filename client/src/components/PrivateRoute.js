/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../store/userContext";
import accessCheck from "../utils/accessCheck";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, action, ...rest }) => {
  const { authUser } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={
        (props) =>
          accessCheck(authUser, action) === true ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        // eslint-disable-next-line react/jsx-curly-newline
      }
    />
  );
};

export default PrivateRoute;
