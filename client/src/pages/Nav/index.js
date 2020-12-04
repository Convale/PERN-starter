import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../store/userContext";
import { logoutUser } from "../../utils/userAuth";
import accessCheck from "../../utils/accessCheck";
import "./style.css";

const Nav = () => {
  const { authUser, setAuthUser } = useContext(UserContext);
  const history = useHistory();
  const { accountStatus } = authUser.userAccess;

  const renderLogoutUser = async (event) => {
    event.preventDefault();
    logoutUser(setAuthUser);
    history.push("/");
  };

  return (
    <div className="nav">
      {accountStatus != null ? (
        <>
          <div className="navItem">
            <Link to="/dashboard">Home</Link>
          </div>
          {accessCheck(authUser, "read:adminUser") === true && (
            <div className="navItem">
              <Link to="/admin">Admin</Link>
            </div>
          )}
          <div className="navItem rightItem">
            <Link to="/" onClick={renderLogoutUser}>
              Sign out
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="navItem">
            <Link to="/">Home</Link>
          </div>
          <div className="navItem rightItem">
            <Link to="/login">Sign in</Link>
          </div>
          <div className="navItem">
            <Link to="/register">Sign Up</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Nav;
