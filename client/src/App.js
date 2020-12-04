import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import { UserContext } from "./store/userContext";
import PrivateRoute from "./components/PrivateRoute";
import userOnLoad from "./utils/userOnLoad";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Nav from "./pages/Nav";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoMatch from "./pages/ErrorPages/404";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordReset from "./pages/ForgotPasswordReset";

const AppRouter = () => {
  const { authUser, setAuthUser } = useContext(UserContext);
  userOnLoad(setAuthUser);

  if (authUser.userCheck !== true) {
    return <div />;
  }

  return (
    <Router>
      <div className="app">
        <Nav />
        <ToastContainer transition={Slide} />
        <Switch>
          {authUser.userAccess.accountStatus === null ? (
            <Route exact path="/" component={Landing} />
          ) : (
            <Route exact path="/" component={Dashboard} />
          )}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route
            path="/auth/verifyemail/:verificationToken"
            component={EmailVerification}
          />
          <Route path="/auth/forgotpassword" component={ForgotPassword} />
          <Route path="/auth/resetpassword/:resetToken" component={ForgotPasswordReset} />
          <PrivateRoute action="read:basicUser" path="/dashboard" component={Dashboard} />
          <PrivateRoute action="read:adminUser" path="/admin" component={Admin} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
