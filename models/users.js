const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({ //password? phoneNumber?
  userId: { //? for register
    type: String,
    require: true,
  },
  displayName: {//missing in register form
    type: String,
    require: true,
  },
  username: String,
  email: String,
  provider: {
    type: String,
    enum: ["github", "google", "register"],
    default: "github",
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

usersSchema.index({ userId: 1, username: 1 });
usersSchema.index({ userId: 1, email: 1 });

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
