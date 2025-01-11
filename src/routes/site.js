const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteControllers");

router.get("/dashboard", siteController.dashboard);

router.get(
    "/profile",
    siteController.checkAuthenticated,
    siteController.profile
);
router.post(
    "/profile",
    siteController.checkAuthenticated,
    siteController.profilePost
);

router.get(
    "/login",
    siteController.checkNotAuthenticated,
    siteController.login
);
router.post(
    "/login",
    siteController.checkNotAuthenticated,
    siteController.loginUser
);

router.get(
    "/register",
    siteController.checkNotAuthenticated,
    siteController.register
);
router.post(
    "/register",
    siteController.checkNotAuthenticated,
    siteController.registerUser
);

router.get("/verify/:userId/:uniqueString", siteController.verifyEmail);

router.get("/verified", siteController.verified);

router.get("/forgot-password", siteController.forgotPassword);
router.post("/forgot-password", siteController.forgotPasswordPost);

router.get("/reset-code", siteController.resetCode);
router.post("/reset-code", siteController.resetCodePost);

router.get("/new-password", siteController.newPassword);
router.post("/new-password", siteController.newPasswordPost);

router.post("/logout", siteController.logout);

router.get("/", siteController.home);

module.exports = router;
