const orderService = require("../services/orderService")
const authService = require("../services/authService")


exports.createOrder = async function (req, res) {
    try {
        const result = await orderService.createOrder(req.loggedInUser._id);
        if (result) {
            const result = await authService.sendotp(req.loggedInUser.email, result);
            res.status(200).json(result)
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(404).json(error.message);
    }
}
exports.getOrder = async function (req, res) {
    try {
        const result = await orderService.getOrder(req.loggedInUser);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json(error.message);
    }
}