/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserContext } from "../../store/userContext";
import { loginUser } from "../../utils/userAuth";
import "./style.css";

const Login = () => {
  const history = useHistory();
  const { setAuthUser } = useContext(UserContext);
  const { handleSubmit, register, errors } = useForm();

  const renderLoginUser = async (user) => {
    try {
      await loginUser(user, setAuthUser);
      history.push("/dashboard");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="auth-contents">
        <div className="form-contents">
          <h1 className="heading">Login</h1>
          <form onSubmit={handleSubmit(renderLoginUser)}>
            <div className="form-row">
              <label>Email Address</label>
              <input
                value="qq@qq.com" // DELETE THIS FOR PROD
                type="email"
                name="email"
                autoComplete="on"
                ref={register({
                  required: "Required",
                  pattern: {
                    // eslint-disable-next-line no-useless-escape
                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && errors.email.message}
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                value="qq" // DELETE THIS FOR PROD
                type="password"
                name="password"
                autoComplete="on"
                ref={register({
                  required: "Required",
                  // minLength: {  // ENABLE THIS FOR PROD
                  //   value: 8,
                  //   message: "Password doesn't meet requirements.",
                  // },
                  // pattern: {
                  //   // eslint-disable-next-line no-useless-escape
                  //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
                  //   message: "Password doesn't meet requirements.",
                  // },
                })}
              />
              {errors.password && errors.password.message}
            </div>
            <div className="form-row">
              <button type="submit">Login</button>
            </div>
          </form>
          <p className="footer-text">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="footer-text">
            Forgot your passwrod?{" "}
            <Link to="/auth/forgotpassword">Request Password Reset</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
