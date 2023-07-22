const userRoutes = require("express").Router();
const { register, login, getUser, saveTask, getTask, deleteTask } = require("../controllers/userController");

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/api/getUserByEmail", getUser);
userRoutes.post("/save", saveTask)
userRoutes.get("/getTasks", getTask)
userRoutes.post("deletePost", deleteTask)

module.exports = userRoutes;
