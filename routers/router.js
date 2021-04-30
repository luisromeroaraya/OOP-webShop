// https://www.youtube.com/watch?v=dDjzTDN3cy8
// IMPORT EXPRESS
const express = require("express");

// CREATE ROUTER
const router = express.Router();

// IMPORT CONTROLLER
const controller = require("../controllers/controller");

// ROUTER
router.get("/", controller.renderHomePage);
router.get("/about.html", controller.renderAboutPage);
router.get("/cart.html", controller.renderCartPage);
router.get("/checkout.html", controller.renderCheckoutPage);
router.get("/contact-us.html", controller.renderContactUsPage);
router.get("/gallery.html", controller.renderGalleryPage);
router.get("/index.html", controller.renderIndexPage);
router.get("/my-account.html", controller.renderMyAccountPage);
router.get("/shop-detail.html", controller.renderShopDetailPage);
router.get("/shop.html", controller.renderShopPage);
router.get("/wishlist.html", controller.renderWishListPage);

router.get("/login.html", controller.login);

router.post("/register", controller.register);
router.post("/signin", controller.signin);
router.post("/logout", controller.logout);
router.post("/newsletter", controller.newsletter);
router.post("/contact", controller.contact);

module.exports = router;