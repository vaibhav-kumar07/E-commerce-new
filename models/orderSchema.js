const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  cartitems: {
    type: String,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI"],
    default: "COD",
    required: true
  },
  estimatedDeliveryDate: {
    type: Date
  },
  trackingNumber: {
    type: String
  },
  orderTimestamp: {
    type: Date,
    default: Date.now
  },

});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
