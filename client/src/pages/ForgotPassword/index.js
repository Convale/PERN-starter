/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { forgotPasswordRequest } from "../../utils/userAuth";
import "./style.css";

const PasswordResetRequest = () => {
  const { handleSubmit, register, errors } = useForm();

  const renderResetRequest = async (user) => {
    try {
      await forgotPasswordRequest(user.email);
      toast.success("Email sent!");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="auth-contents">
        <div className="form-contents">
          <h1 className="heading">Forgot Password</h1>
          <form onSubmit={handleSubmit(renderResetRequest)}>
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
              <button type="submit">Request Password Reset</button>
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

export default PasswordResetRequest;
