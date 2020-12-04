import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserContext } from "../../store/userContext";
import { registerUser, loginUser } from "../../utils/userAuth";
import "./style.css";

const Register = () => {
  const history = useHistory();
  const { setAuthUser } = useContext(UserContext);
  const { handleSubmit, register, errors } = useForm();

  const renderRegisterUser = async (user) => {
    try {
      await registerUser(user);
      setTimeout(async () => {
        try {
          await loginUser(user, setAuthUser);
          history.push("/");
        } catch (error) {
          history.push("/login");
        }
      }, 150);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="auth-contents">
        <div className="form-contents">
          <h1 className="heading">Register account</h1>
          <form onSubmit={handleSubmit(renderRegisterUser)}>
            <div className="form-row">
              <label>Email Address</label>
              <input
                type="text"
                name="email"
                autoComplete="no"
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
              <label>Password</label>q
              <input
                type="password"
                name="password"
                autoComplete="no"
                ref={register({
                  required: "Required",
                  minLength: { value: 8, message: "Password doesn't meet requirements." },
                  pattern: {
                    // eslint-disable-next-line no-useless-escape
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
                    message: "Password doesn't meet requirements.",
                  },
                })}
              />
              {errors.password && errors.password.message}
              <p>
                Passwords must contain 8 characters including 1 uppercase, 1 lowercase,
                and 1 number. It may also include special characters.
              </p>
            </div>
            <div className="form-row">
              <button type="submit">Register</button>
            </div>
          </form>
          <p className="footer-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
