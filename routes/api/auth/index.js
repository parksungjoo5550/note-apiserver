const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.post("/login", require("./login"));

router.use("/me", auth.login);
router.get("/me", require("./authMe"));

router.use("/refresh", auth.login);
router.get("/refresh", require("./refreshToken"));

module.exports = router;
