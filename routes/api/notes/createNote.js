// Models
const Note = require("../../../models").note;
const Publish = require("../../../models").publish;
const Problem = require("../../../models").problem;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const { publishId, problemId, submit } = req.body;

  try {
    if (!publishId || !problemId || !submit)
      throw new Error("모든 항목을 입력해주세요.");
    let duplicate = await Note.findOneByPublishIdAndProblemId(publishId, problemId);
    if (duplicate) throw new Error("publishId와 problemId가 같은 노트를 중복해서 생성할 수 없습니다.");
    let publish = await Publish.findOneById(publishId);
    if (!publish) throw new Error("존재하지 않는 publish입니다.");
    let problem = await Problem.findOneById(problemId);
    if (!problem) throw new Error("존재하지 않는 problem입니다.");
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
