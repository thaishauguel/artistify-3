const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/gdaconcept/image/upload/v1614762472/workshop-artistify/default-profile_tbiwcc.jpg)",
  },
});

const UserModel= mongoose.model("users", userSchema)

module.exports= UserModel