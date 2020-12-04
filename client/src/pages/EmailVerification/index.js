import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../store/userContext";
import { verifyEmailRequest, verifyEmailFURequest } from "../../utils/userAuth";
import "./style.css";

const EmailVerification = ({ match }) => {
  const { authUser } = useContext(UserContext);
  const { verificationToken } = match.params;
  const [verified, setVerified] = useState({ line1: "Verifying Email...", line2: false });

  useEffect(async () => {
    try {
      await verifyEmailRequest(verificationToken);
      setVerified({ line1: "Thanks verifying your email!", line2: false });
    } catch (error) {
      setVerified({
        line1: "Unfortunately we were unable to verify this link.",
        line2: true,
      });
    }
  }, []);

  const renderFURequest = async (event) => {
    event.preventDefault();
    try {
      await verifyEmailFURequest(authUser.accessToken);
      toast.success("Request sent!");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <div>{verified.line1}</div>
      {verified.line2 === true && authUser.accessToken != null && (
        <div>
          <p>Please click the below link to request another verification:</p>
          <button type="button" onClick={renderFURequest}>
            Email Verification Request
          </button>
        </div>
      )}
      {verified.line2 === true && authUser.accessToken == null && (
        <div>
          <p>Please sign in to request another email link.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
