import React, { useContext } from "react";
import { UserContext } from "../../store/userContext";
import "./style.css";

const Admin = () => {
  const { authUser } = useContext(UserContext);

  return (
    <div>
      <h2>Admin</h2>
      <pre>{authUser.userAccess.permissions}</pre>
    </div>
  );
};

export default Admin;
