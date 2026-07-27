const { Router } = require("express");
const controller = require("../controller/Controller");

const router = Router();

router.get("/health", (req, res) => {});
router.get("/preditcitons", (req, res) => {});
router.get("/logout", controller.logout_get);

router.post("/login", controller.login_post);
router.post("/signup", controller.signup_post);
router.post("/predict", controller.predict_post);

module.exports = router;
