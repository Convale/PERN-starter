import React, { createContext, useState } from "react";

const initialState = {
  userCheck: false,
  userAccess: {
    accountStatus: null,
    baseType: null,
    customPermissions: [],
  },
  accessToken: null,
};

export const UserContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(initialState);
  return (
    <UserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </UserContext.Provider>
  );
};
