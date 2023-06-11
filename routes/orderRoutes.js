const express = require("express")
const router = express.Router();
const { createOrder, getOrder } = require("../controllers/orderController")
const { verifyToken, authorizedUser } = require("../controllers/authController")

router.route("/order").post(verifyToken, authorizedUser("Customer"), createOrder);
router.route("/order").get(verifyToken, authorizedUser("Customer"), getOrder);






module.exports = router;