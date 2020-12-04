/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { forgotPasswordReset } from "../../utils/userAuth";
import "./style.css";

const PasswordReset = ({ match }) => {
  const history = useHistory();
  const { resetToken } = match.params;
  const { handleSubmit, register, errors } = useForm();

  const renderResetRequest = async (user) => {
    try {
      // eslint-disable-next-line no-throw-literal
      if (user.password !== user.passwordconfirm) throw "Passwords must match.";
      await forgotPasswordReset(resetToken, user.password);
      toast.success("Password update successful!");
      setTimeout(() => {
        history.push("/login");
      }, 5000);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="auth-contents">
        <div className="form-contents">
          <h1 className="heading">Reset Password</h1>
          <form onSubmit={handleSubmit(renderResetRequest)}>
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
              <label>Password</label>q
              <input
                type="password"
                name="passwordconfirm"
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
              {errors.passwordconfirm && errors.passwordconfirm.message}
              <p>
                Passwords must contain 8 characters including 1 uppercase, 1 lowercase,
                and 1 number. It may also include special characters.
              </p>
            </div>
            <div className="form-row">
              <button type="submit">Reset Password</button>
            </div>
          </form>
          <p className="footer-text">
            Remember you're password? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
