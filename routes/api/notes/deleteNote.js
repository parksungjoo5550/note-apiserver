// Models
const Note = require("../../../models").note;

module.exports = async (req, res) => {
  const userId = req.token.userId;
  const { noteId } = req.query;

  try {
    if (!noteId) throw new Error("모든 항목을 입력해주세요.");
    let options = { where: { studentUserId: userId, id: noteId } };
    let note = await Note.findOne(options);
    if (!note) throw new Error("조건에 맞는 풀이 기록이 없습니다.");
    await Note.destroy(options);

    res.json({
      success: true,
      message: "풀이 기록을 삭제했습니다.",
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
