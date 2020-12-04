import { useEffect } from "react";
import { refreshUserAccess, logoutUser } from "./userAuth";
import config from "./config";

const userOnLoad = (setAuthUser) => {
  const getUser = async () => {
    const initialToken = localStorage.getItem("x-refresh-token");
    if (initialToken) {
      try {
        await refreshUserAccess(initialToken, setAuthUser);
      } catch (error) {
        logoutUser(setAuthUser);
      }
    }
    setAuthUser((authUser) => ({ ...authUser, userCheck: true }));
  };

  useEffect(() => {
    getUser();

    const timeout = setInterval(async () => {
      const continualRefreshToken = localStorage.getItem("x-refresh-token");
      if (continualRefreshToken)
        try {
          await refreshUserAccess(continualRefreshToken, setAuthUser);
        } catch (error) {
          logoutUser(setAuthUser);
        }
    }, config.ACCESS_TOKEN_EXPIRATION * 1000);
    return () => {
      clearInterval(timeout);
    };
  }, []);
};

export default userOnLoad;
