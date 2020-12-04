import React, { useContext } from "react";
import { UserContext } from "../../store/userContext";

const Dashboard = () => {
  const { authUser } = useContext(UserContext);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>{JSON.stringify(authUser, null, 2)}</div>
    </div>
  );
};

export default Dashboard;
