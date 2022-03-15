const jwt = require("jsonwebtoken");
const userModel = require("../model/users");

const authen = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    // console.log(token);
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    //verifyToken._id user _id
    const rootUser = await userModel.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.useID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).send("Unathorize: No Valid Token");
    console.log(error);
  }
};

module.exports = authen;
