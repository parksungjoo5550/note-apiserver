// Models
const Note = require("../../../models").note;
const Publish = require("../../../models").publish;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const { publishId, problemId, submit } = req.body;

  try {
    if (!publishId || !problemId || !submit)
      throw new Error("모든 항목을 입력해주세요.");
    let publish = await Publish.findOneById(publishId);
    if (!publish) throw new Error("잘못된 파라미터입니다.");
    let problem = await problem.findOneById(problemId);
    if (!problem) throw new Error("잘못된 파라미터입니다.");
    let note = {
      collectionId: publish.dataValues.collectionId,
      publishId: publishId,
      problemId: problemId,
      teacherUserId: publish.dataValues.teacherUserId,
      studentUserId: userId,
      submit: submit,
      state: "unconfirmed"
    };
    await Note.create(note);

    res.json({
      success: true,
      message: "풀이 기록을 생성했습니다.",
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
