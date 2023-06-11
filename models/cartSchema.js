const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      Price: {
        type: Number,
        required: true,
      }
    }
  ],
  shippingcharges: {
    type: Number,
    required: true,
    default: 40,
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },

  totalAmount: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});




const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
