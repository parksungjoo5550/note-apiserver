const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.get("/", require("getProblems"));
router.post("/", require("createProblem"));
router.patch("/", require("updateProblem"));

module.exports = router;
