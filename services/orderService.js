// const { findOne } = require("../models/ProductSchema");
const Order = require("../models/orderSchema");
const Cart = require("../models/orderSchema");


exports.createOrder = async function (userid) {
    const cart = await Cart.findOne({ customer: userid });
    const trackingNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + min;
    console.log(cart);
    const order = new Order({
        cartItem: cart.items,
        orderTotal: cart.totalAmount,
        orderStatus,
        paymentMethod,
        estimatedDeliveryDate,
        trackingNumber,
    })
    await order.save();
    return order;
}


exports.getOrder = async function (userid) {
    const cart = await Cart.findOne({ customer: userid });
    const order = await Order.findOne({ cart: cart._id });
    return order;
}