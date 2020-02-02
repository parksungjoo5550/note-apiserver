const router = require("express").Router();
const auth = require("./auth");
const categories = require("./categories");
const collection = require("./collection");
const notes = require("./notes");
const problems = require("./problems");
const publishes = require("./publishes");
const users = require("./users");

router.use("/auth", auth);
router.use("/users", users);
router.use("/problems", problems);
router.use("/exams", collection);
router.use("/homeworks", collection);
router.use("/workpapers", collection);
router.use("/publishes", publishes);
router.use("/notes", notes);
router.use("/categories", categories);

module.exports = router;
