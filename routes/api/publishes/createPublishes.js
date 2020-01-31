// Models
const Collection = require("../../../models").collection;
const Publish = require("../../../models").publish;
const Student = require("../../../models").student;

module.exports = async (req, res) => {
  const token = req.token;
  const { type, sourceId, title, targetUserIds } = req.body;

  try {
    if (!type || !sourceId || !title || !targetUserIds)
      throw new Error("모든 항목을 입력해주세요.");
    // Non-regular student can't publish collection.
    // Student can't publish collection to others.
    if (token.type === "student") {
      let student = await Student.findOneByUserId(token.userId);
      if (!student) throw new Error("계정 정보가 손상되었습니다.");
      if (
        student.dataValues.isRegular === false ||
        !(targetUserIds.length === 1 && targetUserIds.includes(token.userid))
      )
        throw new Error("권한이 없습니다.");
    }
    let collection = await Collection.findOne({
      where: { id: sourceId, userId: token.userId }
    });
    if (!collection) throw new Error("해당 소스가 존재하지 않습니다.");

    Publish.bulkCreate(
      targetUserIds.map(targetUserId => {
        return {
          teacherID: token.type === "student" ? null : token.userId,
          studentID: targetUserId,
          collectionType: type,
          collectionID: sourceId,
          remainingTime:
            collection.dataValues.type === Collection.EXAM
              ? collection.dataValues.timeLimit
              : null,
          state: Publish.PUBLISHED
        };
      })
    );

    res.json({
      success: true,
      message: "Publish를 생성했습니다.",
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
