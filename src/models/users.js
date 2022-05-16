const mongoose = require("mongoose");

//ADD WALLET!
const usersSchema = mongoose.Schema({
  displayName: { //first name + last name
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  email: String,
  provider: {
    type: String,
    enum: ["github", "google", "register"],
    default: "github",
  },
  password: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

usersSchema.index({ username: 1 });
usersSchema.index({ email: 1 });

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
