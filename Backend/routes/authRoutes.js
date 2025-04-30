const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protected routes
router.use(authController.protect); // Protect all routes after this middleware
router.get("/me", authController.getCurrentUser);
router.patch("/updatePassword", authController.updatePassword);

module.exports = router;
