// Modules
const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

// Models
const Student = require("../../../models").student;
const Problem = require("../../../models").problem;
const Collection = require("../../../models").collection;
const CollectionProblem = require("../../../models").collection_problem;

module.exports = async (req, res) => {
  const reqType = req.baseUrl.slice(5);
  const { title, problemIds, timeLimit } = req.body;

  try {
    // Non-regular student can't create collection.
    if (req.token.type === "student") {
      let student = await Student.findOneByUserId(req.token.userId);
      if (!student) throw new Error("잘못된 계정입니다.");
      else {
        if (student.dataValues.isRegular == false)
          throw new Error("권한이 없습니다.");
      }
    }
    if (!title || !problemIds || (reqType === "exams" && !timeLimit))
      throw new Error("모든 항목을 입력해주세요.");
    if (problemIds.length !== Array.from(new Set(problemIds)).length)
      throw new Error("중복되는 문제가 있습니다.");
    let problemIds2 = problemIds;

    // Create a PDF file.
    let doc = new pdfDocument();
    let pdfURL = path.join(
      "/uploads/pdfs",
      ["pdf", Date.now() + ".pdf"].join("-")
    );

    doc.pipe(fs.createWriteStream(path.join(global.__basedir, pdfURL)));

    // Draw Title.
    doc.fontSize(30);
    doc.text(title, 0, 10, { width: doc.page.width, align: "center" });

    // Make a page contain 2 images.
    let pageNumber = 1;

    while (problemIds.length > 0) {
      // Footer
      doc.fontSize(12);
      doc.page.margins.bottom = 0;
      doc.text(
        `- ${pageNumber} -`,
        0.5 * (doc.page.width - 100),
        doc.page.height - 40,
        {
          width: 100,
          align: "center",
          lineBreak: false
        }
      );

      // Vertical line
      doc
        .moveTo(doc.page.width / 2, 50)
        .lineTo(doc.page.width / 2, doc.page.height - 50)
        .stroke();

      // Image 1
      let problem = await Problem.findOneById(problemIds2[0]);
      if (problem == null || problem.dataValues.active == false)
        throw new Error(`${problemIds2[0]}번 문제는 이용할 수 없습니다.`);

      problemIds2.shift();
      doc.image(
        path.join(global.__basedir, problem.dataValues.problemURL),
        10,
        50,
        {
          width: doc.page.width / 2 - 20
        }
      );

      // Image 2
      if (problemIds2.length > 0) {
        problem = await Problem.findOneById(problemIds2[0]);
        if (problem == null || problem.dataValues.active == false)
          throw new Error(`${problemIds2[0]}번 문제는 이용할 수 없습니다.`);

        problemIds2.shift();
        doc.image(
          path.join(global.__basedir, problem.dataValues.problemURL),
          doc.page.width / 2 + 10,
          50,
          { width: doc.page.width / 2 - 20 }
        );
      }

      if (problemIds2.length == 0) break;

      doc.addPage();
      pageNumber++;
    }

    doc.end();

    // DB
    let collection = await Collection.create({
      userId: req.token.userId,
      title: title,
      pdfURL: pdfURL,
      timeLimit: timeLimit == undefined ? 0 : timeLimit,
      type: reqType.slice(0, -1),
      createdAt: new Date()
        .toISOString()
        .substring(0, 19)
        .replace("T", " ")
    });
    problemIds2 = problemIds;
    let collection_problems_form = await problemIds2.map(problemId => {
      return {
        collectionId: collection.id,
        problemId: problemId
      };
    });
    await CollectionProblem.bulkCreate(collection_problems_form);

    res.json({
      success: true,
      message: "새로운 " + reqType.slice(0, -1) + "을 생성했습니다.",
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
