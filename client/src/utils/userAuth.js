/*                      */
/*   Helper Functions   */
/*                      */

const postFetchFunction = async (path, payload, authToken) => {
  // eslint-disable-next-line no-return-await
  const response = await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

const getFetchFunction = async (path, authToken) => {
  // eslint-disable-next-line no-return-await
  const response = await fetch(`${process.env.REACT_APP_API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.json();
};

const setUser = (result, setAuthUser) => {
  setAuthUser((authUser) => ({
    ...authUser,
    userAccess: result.userAccess,
    accessToken: result.accessToken,
  }));
};

/*                            */
/*   Authentication Actions   */
/*                            */

const loginUser = async (user, setAuthUser) => {
  const path = "/auth/login";
  const response = await postFetchFunction(path, user, null);
  if (response.success !== true) throw response.errorMessage;
  setUser(response, setAuthUser);
  localStorage.setItem("x-refresh-token", response.refreshToken);
};

const logoutUser = (setAuthUser) => {
  setAuthUser((authUser) => ({
    ...authUser,
    userAccess: {
      baseType: null,
      accountStatus: null,
      permissions: [],
    },
    accessToken: null,
  }));
  localStorage.removeItem("x-refresh-token");
};

const refreshUserAccess = async (refreshToken, setAuthUser) => {
  const path = "/auth/updateaccesstoken";
  const response = await getFetchFunction(path, refreshToken);
  if (response.success !== true) throw response.errorMessage;
  setUser(response, setAuthUser);
};

const registerUser = async (user) => {
  const path = "/auth/createuser";
  const response = await postFetchFunction(path, user, null);
  if (response.success !== true) throw response.errorMessage;
};

const verifyEmailRequest = async (verificationToken) => {
  const path = "/auth/verifyemail";
  const response = await getFetchFunction(path, verificationToken);
  if (response.success !== true) throw response.errorMessage;
};

const verifyEmailFURequest = async (accessToken) => {
  const path = "/auth/verifyemailfurequest";
  const response = await getFetchFunction(path, accessToken);
  if (response.success !== true) throw response.errorMessage;
};

const forgotPasswordRequest = async (email) => {
  const path = "/auth/forgotpassword";
  const response = await postFetchFunction(path, { email }, null);
  if (response.success !== true) throw response.errorMessage;
};

const forgotPasswordReset = async (resetToken, password) => {
  const path = "/auth/resetpassword";
  const response = await postFetchFunction(path, { password }, resetToken);
  if (response.success !== true) throw response.errorMessage;
};

module.exports = {
  loginUser,
  logoutUser,
  refreshUserAccess,
  registerUser,
  verifyEmailRequest,
  verifyEmailFURequest,
  forgotPasswordRequest,
  forgotPasswordReset,
};
