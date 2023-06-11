const cartServcie = require("../services/cartService")




exports.addProductToCart = async function (req, res) {
    try {
        const { products } = req.body;
        console.log(products)
        const result = await cartServcie.addProductToCart(req.loggedInUser._id, products);
        res.status(200).json(result);
    } catch (error) {
        console.log("error");
        res.status(404).json(error.message);
    }
}

exports.getCartDetails = async function (req, res) {
    try {
        const result = await cartServcie.getCartDetails(req.loggedInUser._id);
        if (result == "null")
            res.status(404).json("cart doesnot exist");
        else
            res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message);
    }
}