const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.post("/", require("./createUser"));
router.delete("/", require("./deleteUser"));
router.get("/", require("./getUsers"));
router.patch("/", require("./updateUser"));

module.exports = router;
