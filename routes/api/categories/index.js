const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.teacher);
router.post("/", require("./createCategory"));

router.use("/", auth.teacher);
router.delete("/", require("./deleteCategory"));

router.use("/", auth.login);
router.get("/", require("./getCategories"));

module.exports = router;
