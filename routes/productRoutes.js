const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById
} = require("../controllers/productController");
const { verifyToken, userRoleAuthorize, authorizedUser } = require("../controllers/authController");



///according to admin Role
router.route("/").post(verifyToken, authorizedUser("Admin"), createProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(verifyToken, authorizedUser("Admin"), getProductById);
router.route("/:id").patch(verifyToken, authorizedUser("Admin"), updateProduct);
router.route("/:id/").delete(verifyToken, authorizedUser("Admin"), deleteProduct);

module.exports = router;

