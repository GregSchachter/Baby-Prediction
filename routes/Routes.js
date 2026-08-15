const { Router } = require("express");
const controller = require("../controller/Controller");

const router = Router();

router.get("/predictions", controller.predictions_get);
router.get("/logout", controller.logout_get);
router.get("/me", controller.me_get);
// router.get("/emailtest", controller.email_test);

router.post("/forgotpassword", controller.forgotPassword_post);
router.post("/login", controller.login_post);
router.post("/signup", controller.signup_post);
router.post("/predict", controller.predict_post);
router.post("/resetpassword", controller.reset_post);
router.post("/verifytoken", controller.verify_reset_token_post);

router.patch("/predict", controller.predict_patch);

module.exports = router;
