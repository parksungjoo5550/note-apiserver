// Models
const Note = require("../../../models").note;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const { noteId } = req.query;
  const { submit } = req.body;

  try {
    if (!noteId || !submit) throw new Error("모든 항목을 입력해주세요.");
    let options = { where: { studentUserId: userId, id: noteId } };
    let note = await Note.findOne(options);
    if (!note) throw new Error("조건에 맞는 풀이 기록이 없습니다.");
    note.submit = submit;
    await note.save();

    res.json({
      success: true,
      message: "풀이 기록 답안을 수정했습니다.",
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
