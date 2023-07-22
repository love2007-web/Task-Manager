const jsonwebtoken = require("jsonwebtoken");
const env = require("dotenv")
env.config()
const secret = process.env.JWT_SECRET;

const generateToken = (email) => {
  try {
    let token = jsonwebtoken.sign({ email}, secret, { expiresIn: "5m" });
    return token;
  } catch (error) {
    console.log(error);
    throw {
      name: "AuthenticationError",
      message: "Error generating token",
      error: error,
    };
  }
};

const verifyToken = (token) => {
  try {
    if (!token) throw { name: "AuthenticationError", message: "Invalid Token" };
    const decoded = jsonwebtoken.sign(token, secret);
    console.log(decoded);
    let email = decoded.email;
    return email;
  } catch (error) {
    console.log(error);
    throw {
      name: "AuthenticationError",
      message: `Error verifying token`,
      error: error,
    };
  }
};

module.exports = { generateToken, verifyToken };
