const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.get("/", require("./getNotes"));
router.post("/", require("./createNote"));
router.patch("/", require("./updateNote"));
router.delete("/", require("./deleteNote"));

module.exports = router;
