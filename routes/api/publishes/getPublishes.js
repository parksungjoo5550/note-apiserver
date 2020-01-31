// Models
const Collection = require("../../../models").collection;
const Publish = require("../../../models").publish;

module.exports = async (req, res) => {
  const { publishId, type, state } = req.query;

  try {
    let data = {};
    if (publishId) {
      let publish = await Publish.findOneById(publishId);
      if (!publish) throw new Error("존재하지 않는 발행입니다.");
      if (req.token.type === "teacher") {
        if (publish.dataValues.teacherUserId !== req.token.userId)
          throw new Error("본인 소유의 발행만 조회할 수 있습니다.");
      } else if (req.token.type === "student") {
        if (publish.dataValues.studentUserId !== req.token.userId)
          throw new Error("본인 소유의 발행만 조회할 수 있습니다.");
      }
      data.publish = publish.dataValues;
    } else {
      let options = {
        where: {}
      };
      if (req.token.type === "teacher") {
        options.where.teacherUserId = req.token.userId;
      } else if (req.token.type === "student") {
        options.where.studentUserId = req.token.userid;
      }
      if (type) options.where.collectionType = type;
      if (state) options.where.state = state;

      let results = await Publish.findAll(options);
      let publishes = await Promise.all(
        results.map(r => {
          let item = {
            id: r.dataValues.id,
            title: r.dataValues.title,
            state: r.dataValues.state
          };
          let collection = Collection.findOneById(r.dataValues.collectionId);
          if (!collection) throw new Error("존재하지 않는 시험입니다.");
          if (collection.dataValues.type === Collection.EXAM) {
            item.remainingTime = r.dataValues.remainingTime;
          }
          item[collection.dataValues.type] = collection.dataValues;
          return item;
        })
      );
      data.publishes = publishes;
    }

    res.json({
      success: true,
      message: "발행 리스트를 조회 완료했습니다.",
      data: data,
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
