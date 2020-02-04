const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.post("/", require("./createCategory"));
router.delete("/", require("./deleteCategory"));
router.get("/", require("./getCategories"));

module.exports = router;
