const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.get("/", require("./getCollections"));
router.post("/", require("./createCollection"));
router.patch("/", require("./updateCollection"));
router.delete("/", require("./deleteCollection"));

module.exports = router;
