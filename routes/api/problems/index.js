const router = require("express").Router();
const auth = require("../../../middlewares/auth");

router.use("/", auth.login);
router.get("/", require("./getProblems"));
router.post("/", require("./createProblem"));
router.patch("/", require("./updateProblem"));

router.use("/blacklist", auth.teacher);
router.get("/blacklist", require("./getProblemsBlacklist"));
router.post("/blacklist", require("./addProblemBlacklist"));
router.delete("/blacklist", require("./removeProblemBlacklist"));

module.exports = router;
