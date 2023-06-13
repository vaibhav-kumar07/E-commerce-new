const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailRegex = /^(?!.*[<>]).*[\w+\-.]+@[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})+$/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 15,
    // validate: {
    //   validator: function (name) {
    //     // Input validation regex
    //     const regex = /^[a-zA-Z0-9\s-]*$/;
    //     return regex.test(name);
    //   },
    //   message: "Invalid name format.",
    // },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "Admin", "Consumer",
    ],
    default: "Consumer",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false
  },
  token: {
    value: {
      type: String
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000, // Expires after 24 hours
    }
  },
  otp: {
    value: {
      type: String
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000, // Expires after 24 hours
    }

  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}
)

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model("User", userSchema);