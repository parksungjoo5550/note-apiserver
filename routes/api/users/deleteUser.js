// Modules
const fs = require("fs");
const path = require("path");

// Models
const User = require("../../../models").user;
const Teacher = require("../../../models").teacher;
const Student = require("../../../models").student;
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collectionProblem;
const DislikedProblem = require("../../../models").dislikedProblem;
const Publish = require("../../../models").publish;
const Note = require("../../../models").note;

module.exports = async (req, res) => {
  const { userId, username, name } = req.query;
  const { password } = req.body;

  try {
    let userIdExists = userId && !username && !name;
    let usernameExists = !userId && username && !name;
    let nameExists = !userId && !username && name;
    let oneOfThreeExists = userIdExists + usernameExists + nameExists === 1;
    if (req.token.type !== "admin") {
      if (!oneOfThreeExists) throw new Error("하나의 파라미터만 입력해주세요.");
      if (!password) throw new Error("비밀번호를 입력해주세요.");
      let userEqual = true;
      if (userIdExists) userEqual = userId === req.token.userId;
      if (usernameExists) userEqual = username === req.token.username;
      if (nameExists) userEqual = name === req.token[req.token.type].name;
      if (userEqual !== true)
        throw new Error("본인 계정만 탈퇴할 수 있습니다.");
    }

    let userByUserId = await User.findOneById(userId);
    let userByUsername = await User.findOneById(username);
    let teachersByName = await Teacher.findAllByName(name);
    let studentsByName = await Student.findAllByName(name);
    if (
      !userByUserId &&
      !userByUsername &&
      teachersByName.length === 0 &&
      studentsByName.length === 0
    )
      throw new Error("존재하지 않는 계정입니다.");
    else if (teachersByName.length + studentsByName.length > 1)
      throw new Error(
        "이름이 중복되는 계정들이 있습니다. 다른 파라미터를 사용해주세요."
      );
    let user =
      userByUserId ||
      userByUsername ||
      (await User.findOneById(teachersByName[0].dataValues.userId)) ||
      (await User.findOneById(studentsByName[0].dataValues.userId));
    if (user === null || user === undefined)
      user = await User.findOneById(req.token.userId);
    if (!user.verify(password))
      throw new Error("비밀번호가 일치하지 않습니다.");

    // Delete all involved exams/homeworks/workpapers/publishes.
    let collectionList = await Collection.findAll({
      where: { userId: user.id }
    });

    async () => {
      for (let i = 0; i < collectionList.length; i++) {
        await CollectionProblem.destroy({
          where: { collectionId: collectionList[i].dataValues.id }
        });
        fs.unlink(
          path.join(global.__basedir, collectionList[i].dataValues.pdfURL),
          function(err) {
            if (err) console.log(err);
          }
        );
      }
    };

    await Collection.destroy({ where: { userId: user.id } });
    await Note.destroy({ where: { userid: user.id } });
    await Student.destroy({ where: { userId: user.id } });
    await Teacher.destroy({ where: { userId: user.id } });
    await DislikedProblem.destroy({ where: { userId: user.id } });
    await Publish.destroy({ where: { teacherUserId: user.id } });
    await Publish.destroy({ where: { studentUserId: user.id } });
    await User.destroy({ where: { id: user.id } });

    res.json({
      success: true,
      message: "회원 탈퇴하였습니다.",
      ecode: 200
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
