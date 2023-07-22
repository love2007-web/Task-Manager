const {userModel, taskModel} = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../services/sessions");
// const { sendMessage } = require("../utilities/mailer");

const register = async (req, res, next) => {
  try {
    let { fullName, email, password } = req.body;
    const newUser = new userModel({
      fullName,
      email,
      password,
    });

    const result = await newUser.save();
    console.log(result);
    return res
      .status(201)
      .send({ message: "Registration Successful", status: true });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "You do not have an account with us", status: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    const token = generateToken(email);
    if (isMatch) {
      return res
        .status(200)
        .send({ message: `Login Successful`, status: true, token });
    }
    verifyToken
    return res.status(401).send({ message: "Invalid Password", status: false });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res) => {
  const { email } = req.body; // This line extracts the email from the request body

  try {
    // Search for the user in the database based on the email
    const user = await userModel.findOne({ email });

    if (user) {
      // If the user is found, return the user data as the response
      res.json({ user });
    } else {
      // If the user is not found, return an error response
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error searching for user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveTask = async (req, res)=>{
    try {
      const {title, description, dueDate, assignedUser, email} = req.body
      const newTask = new taskModel({
        title,
        description,
        dueDate,
        assignedUser,
        email,
      });

      const result = await newTask.save();
      console.log(result);
      return res
        .status(201)
        .send({ message: "Task added Successful", status: true });
    } catch (error) {
      console.log(error);
    }
}

const getTask = async (req, res)=>{
  // const token = req.headers.authorization.split(" ")[1];
  const users = await taskModel.find({}, { email: 1, title: 1, description: 1, dueDate: 1 });
  res.status(200).send(users);
  }

  const deleteTask = async (req, res)=>{
    const taskId = req.body;
    console.log(taskId);

  try {
    // Find the task by its ID and delete it
    const deletedTask = await taskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { register, login, getUser, saveTask, getTask, deleteTask };