const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require('dotenv')
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middlewares/errorHandler");
env.config();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/users", userRoutes);
app.use(errorHandler);


port = process.env.PORT;
uri = process.env.URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
