const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.cookies.token;
  try {
    if (!token) throw new Error("로그인을 해주세요.");
    req.token = await jwt.verify(token, req.app.get("jwt-secret"));
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};

exports.admin = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  try {
    if (!token) throw new Error("로그인이 필요합니다.");
    req.token = await jwt.verify(token, req.app.get("jwt-secret"));
    if (req.token.type !== "admin") throw new Error("관리자 권한이 없습니다.");
    else next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};

exports.teacher = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  try {
    if (!token) throw new Error("로그인이 필요합니다.");
    req.token = await jwt.verify(token, req.app.get("jwt-secret"));
    if (req.token.type !== "admin" || req.token.type !== "teacher")
      throw new Error("선생 권한이 없습니다.");
    else next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};

exports.student = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.query.token;
  try {
    if (!token) throw new Error("로그인이 필요합니다.");
    req.token = await jwt.verify(token, req.app.get("jwt-secret"));
    if (req.token.type !== "admin" || req.token.type !== "student")
      throw new Error("선생 권한이 없습니다.");
    else next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
      ecode: 403
    });
  }
};
