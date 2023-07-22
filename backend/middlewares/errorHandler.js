const jwt = require("jsonwebtoken");
const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === "AuthenticationError") {
    return res
      .status(401)
      .send({ message: error.message || "Authentication error" });
  } else if ((error.name = "MongoError")) {
    if ((error.code = 11000)) {
      return res
        .status(400)
        .send({
          message:
            "A user has signed up with this email",
        });
    }
  } else if (error instanceof jwt.JsonWebTokenError) {
    return res
      .status(401)
      .send({ message: error.message || "Authentication error" });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
  next();
};

module.exports = { errorHandler };
