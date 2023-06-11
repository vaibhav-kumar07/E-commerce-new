const express = require("express")
const router = express.Router();


const { addProductToCart, getCartDetails } = require("../controllers/cartController");
const { verifyToken, authorizedUser } = require("../controllers/authController");

router.route("/cart").post(verifyToken, authorizedUser("Customer"), addProductToCart);
router.route("/cart").get(verifyToken, authorizedUser("Customer"), getCartDetails);

module.exports = router;