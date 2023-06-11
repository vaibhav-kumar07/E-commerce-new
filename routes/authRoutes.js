const express = require("express")
const router = express.Router();
const { createUser, verifyEmail, login, logout, changePassword, verifyToken } = require("../controllers/authController");


router.route("/signUp").post(createUser);
router.route("/emailVerification").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(verifyToken, logout);
router.route("/changePassword").post(verifyToken, changePassword)
// router.route("/forgotPassword").post(resetPassword);



module.exports = router;
