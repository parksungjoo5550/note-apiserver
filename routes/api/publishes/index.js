const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.get("/", require("./getPublishes"));
router.post("/", require("./createPublishes"));
router.patch("/", require("./updatePublish"));
router.delete("/", require("./deletePublish"));

module.exports = router;
