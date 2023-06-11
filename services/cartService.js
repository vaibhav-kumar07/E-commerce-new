const Product = require("../models/ProductSchema");
const Cart = require("../models/cartSchema");


exports.addProductToCart = async function (id, productsDetails) {
    let cart = await Cart.findOne({ customer: id });
    if (cart) {
        console.log("cart exisits");

        for (const item of productsDetails) {
            const existingItem = cart.items.find(cartItem => cartItem.product === item.productId);
            console.log("existing item", existingItem);
            if (existingItem) {
                existingItem.quantity += item.quantity;
                cart.items.push({ product: item.productId, quantity: existingItem.quantity, Price: existingItem.Price });
            } else {
                constinue
            }
        }
        await cart.save();
        return cart;
    } else {
        console.log("entering else")
        const newCart = new Cart({ customer: id, items: [], shippingcharges: 40 });

        for (const item of productsDetails) {
            const existingItem = await Product.findById(item.productId);
            if (existingItem) {
                const cartItem = {
                    product: item.productId,
                    quantity: item.quantity,
                    Price: existing.Price
                };
                newCart.items.push(cartItem);
            }
            else {
                continue;
            }
        }

        await newCart.save();
        return newCart;
    }
};



exports.getCartDetails = async function (customerId) {
    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
        return null;
    }

    let subtotal = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.product);

        if (product) {
            subtotal += item.quantity * product.Price;
        }
    }
    const totalAmount = subtotal + cart.shippingcharges;

    return { cart, subtotal, totalAmount };

};
