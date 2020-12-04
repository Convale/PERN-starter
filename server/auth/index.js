const express = require("express");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const bcrypt = require("bcrypt");
const pool = require("../db");
const config = require("../helpers/config");
const emailHandler = require("../helpers/emailHandler");

const router = express.Router();

/*                      */
/*   Helper Functions   */
/*                      */

const hashPass = async (password) => {
  return await bcrypt.hash(password, 12);
};

const tokenCheck = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw "Unable to authenticate. Please send new request.";
  }
};

const generateTokens = (userQueryResults, whichTokens) => {
  let accessToken;
  let refreshToken;

  if (whichTokens === "access" || whichTokens === "both") {
    const accessTokenPayload = {
      id: userQueryResults.rows[0].user_id,
      userAccess: userQueryResults.rows[0].user_access,
    };
    accessToken = jwt.sign(accessTokenPayload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRATION * 1,
    });
  }

  if (whichTokens === "refresh" || whichTokens === "both") {
    const refreshTokenSecret =
      config.REFRESH_TOKEN_SECRET + userQueryResults.rows[0].password;
    refreshToken = jwt.sign(
      { id: userQueryResults.rows[0].user_id },
      refreshTokenSecret,
      {
        expiresIn: config.REFRESH_TOKEN_EXPIRATION * 1,
      }
    );
  }
  return { accessToken, refreshToken };
};

const requestVerificationEmail = async (email) => {
  const verificationToken = jwt.sign(email, config.VERIFICATION_TOKEN_SECRET);
  emailHandler.sendVerificationEmail(verificationToken, email);
};

/*                            */
/*   Authentication Actions   */
/*                            */

router.post("/createuser", async (req, res) => {
  const { password, email } = req.body;
  const userAccess = {
    accountStatus: "unverified",
    baseType: "regular",
    customPermissions: [],
  };
  try {
    const alreadyUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [
      email,
    ]);
    if (alreadyUser.rowCount != 0) throw "This email is already in use.";
    const passwordHash = await hashPass(password);
    const createId = pool.query(
      `INSERT INTO users(password, email, user_access) VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING user_id`,
      [passwordHash, email, userAccess]
    );
    if (createId.rowCount === 0) throw "Couldn't insert user info, please try again.";
    await requestVerificationEmail(email);
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQueryResults = await pool.query(
      "SELECT user_id, password, user_access FROM users WHERE email = $1",
      [email]
    );
    if (userQueryResults.rowCount === 0) throw "Password/Username supplied is incorrect.";

    const passCheck = await bcrypt.compare(password, userQueryResults.rows[0].password);
    if (passCheck === false) throw "Password/Username supplied is incorrect.";

    const { accessToken, refreshToken } = generateTokens(userQueryResults, "both");
    const response = {
      success: true,
      userId: userQueryResults.rows[0].user_id,
      userAccess: userQueryResults.rows[0].user_access,
      accessToken,
      accessTokenExpiration: Date.now() / 1000 + config.ACCESS_TOKEN_EXPIRATION,
      refreshToken,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

router.get("/updateaccesstoken", async (req, res) => {
  const refreshToken = req.headers["authorization"].split(" ")[1];
  const decoded = jwtDecode(refreshToken);
  try {
    const userQueryResults = await pool.query(
      "SELECT user_id, password, user_access FROM users WHERE user_id = $1",
      [decoded.id]
    );
    if (userQueryResults.rowCount === 0) throw "User not found";
    const refreshTokenSecret =
      config.REFRESH_TOKEN_SECRET + userQueryResults.rows[0].password;

    await tokenCheck(refreshToken, refreshTokenSecret);

    const { accessToken } = generateTokens(userQueryResults, "access");
    const response = {
      success: true,
      accessToken,
      userAccess: userQueryResults.rows[0].user_access,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

// ToDo: fix alreadyUser.rows[0]["?column?"]
router.get("/verifyemail", async (req, res) => {
  const verificationToken = req.headers["authorization"].split(" ")[1];
  try {
    const verifiedJwt = await tokenCheck(
      verificationToken,
      config.VERIFICATION_TOKEN_SECRET
    );
    const alreadyUser = await pool.query(
      "SELECT email_verified, user_access->>'accountStatus' FROM users WHERE email = $1",
      [verifiedJwt]
    );

    if (!alreadyUser.email_verified && alreadyUser.rows[0]["?column?"] === "unverified") {
      const updated = await pool.query(
        `UPDATE users SET email_verified = CURRENT_TIMESTAMP, user_access = jsonb_set(user_access, '{accountStatus}', '"active"') WHERE email = $1 RETURNING email_verified`,
        [verifiedJwt]
      );
      if (!updated) throw "Internal Server Error";
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

router.get("/verifyemailfurequest", async (req, res) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  try {
    const decoded = jwtDecode(accessToken);
    const userQuery = await pool.query("SELECT email FROM users WHERE user_id = $1", [
      decoded.id,
    ]);
    const email = userQuery.rows[0].email;
    await requestVerificationEmail(email);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const alreadyUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [
      email,
    ]);
    if (alreadyUser.rowCount === 0) throw "Couldn't find a user with this address.";
    const passwordResetToken = jwt.sign({ email }, config.RESET_TOKEN_SECRET, {
      expiresIn: config.RESET_TOKEN_EXPIRATION,
    });
    await emailHandler.sendPasswordResetEmail(passwordResetToken, email);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

router.post("/resetpassword", async (req, res) => {
  const resetToken = req.headers["authorization"].split(" ")[1];
  const { password } = req.body;
  try {
    const verifiedJwt = await tokenCheck(resetToken, config.RESET_TOKEN_SECRET);
    const passwordHash = await hashPass(password);
    const updatedPass = pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [
      passwordHash,
      verifiedJwt.email,
    ]);
    if (updatedPass === false) throw "Couldn't update password.";
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, errorMessage: error });
  }
});

module.exports = router;
