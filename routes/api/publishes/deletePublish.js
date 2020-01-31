// Models
const Publish = require("../../../models").publish;

module.exports = async (req, res) => {
  const { publishId } = req.query;

  try {
    if (!publishId) throw new Error("모든 입력값을 입력해주세요.");

    let publish = await Publish.findOne({ where: { id: publishId } });
    if (!publish) throw new Error("발행이 존재하지 않습니다.");

    if (req.token.type === "student") {
      if (
        publish.dataValues.studentUserId !== req.token.userId ||
        publish.dataValues.teacherID != null
      )
        throw new Error("권한이 없습니다.");
    } else if (req.token.type === "teacher") {
      if (publish.dataValues.teacherUserId !== req.token.userId)
        throw new Error("권한이 없습니다.");
    }

    await Publish.destroy({ where: { id: publishId } });

    res.json({
      success: true,
      message: "해당 Publish를 삭제했습니다.",
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
