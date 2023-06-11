const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    maxlength: 15,
    validate: {
      validator: function (name) {
        const regex = /^[a-zA-Z0-9\s.,-]*$/;
        return regex.test(name);
      },
      message: "Invalid name format.",
    },
  },
  Description: {
    type: String,
    required: true,
    maxlength: 500,
    validate: {
      validator: function (name) {
        const regex = /^[a-zA-Z0-9\s.,?!@#$%^&*()-_+'":;\[\]{}|~]*$/;
        return regex.test(name);
      },
      message: "Invalid name format.",
    },
  },
  Price: {
    type: Number,
    required: true,
  },
  Availability: {
    type: Boolean,
    required: true,
  },
  Category: {
    type: String,
    enum: {
      values: [
        "Personal care",
        "Electronics",
        "Baby care",
        "Dairy",
        "tea-coffee",
        "food",
        "fruits",
      ],
      message:
        'Invalid category. Valid categories are: "Personal care", "Electronics", "Baby care", "Dairy", "tea-coffee", "food".',
    },
    required: true,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
