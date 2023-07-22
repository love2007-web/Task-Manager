const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true},
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true, trim: true },
});

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  assignedUser: {type: String, required: true, trim: true},
  dueDate: {type: String, required: true, trim: true},
  email: {type:String, required: true, trim: true}

})

let saltRound = 10;
userSchema.pre("save", function (next) {
  if (this.password != undefined) {
    bcrypt
      .hash(this.password, saltRound)
      .then((hashed) => {
        this.password = hashed;
        next();
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

const userModel =
  mongoose.models.user_tbs || mongoose.model("user_tbs", userSchema);

  const taskModel =
    mongoose.models.task_tbs || mongoose.model("task_tbs", taskSchema);

module.exports = {userModel, taskModel};
