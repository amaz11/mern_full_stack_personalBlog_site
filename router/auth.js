const express = require("express");
const router = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authen = require("../auth/authen");

router.get("/", async (req, res) => {
  try {
    const getData = await userModel.find();
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send(`Something is not right: ${error}`);
  }
});

router.post("/register", async (req, res) => {
  // console.log(req.body);
  const { name, email, mobile, profession, password, conpassword } = req.body;
  if (!name || !email || !mobile || !profession || !password || !conpassword) {
    return res.status(422).json({ error: "Pleas fill the Form" });
  }
  try {
    const userEmailExist = await userModel.findOne({ email });
    const userMobileExist = await userModel.findOne({ mobile });
    if (userEmailExist) {
      return res.status(422).json({ error: "Email Already Exist" });
    }
    if (userMobileExist) {
      return res.status(422).json({ error: "Mobile Already Exist" });
    }
    // if (mobile === userMobileExist) {
    //   return res.status(422).json({ error: "Mobile Already Exist" });
    // }
    if (password === conpassword) {
      const postData = new userModel({
        name,
        email,
        mobile,
        profession,
        password,
        conpassword,
      });
      // easy way use hash password this two line
      // const salt = await bcrypt.genSalt(10);
      // postData.password = await bcrypt.hash(postData.password, salt);

      //middelware use to hash the password in users Schema file ("../model/users") before save method executed

      const savePostData = await postData.save();
      return res.status(201).json({ message: "Data Save in Db Successfully" });
    } else {
      return res.status(400).json({ error: "Password is Not matching" });
    }
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Pleas fill the Form" });
    // res.send("Fill the Form");
  }
  try {
    const userEmailExist = await userModel.findOne({ email });
    const bcryptPasswordComp = await bcrypt.compare(
      password,
      userEmailExist.password
    );
    if (userEmailExist && bcryptPasswordComp) {
      const token = await userEmailExist.generateAuthToken();
      res.cookie("jwtoken", token, {
        httpOnly: true,
      });
      // console.log(token);
      res.status(201).send("Login Succesfully");
    } else {
      res.status(400).send("Not Valid Info");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

router.get("/about", authen, (req, res) => {
  res.send(req.rootUser);
});

router.get("/getdata", authen, (req, res) => {
  res.send(req.rootUser);
});
router.post("/contact", authen, async (req, res) => {
  const { name, email, mobile, message } = req.body;
  if (!name || !email || !mobile || !message) {
    return res.status(422).json({ error: "Pleas fill the Form" });
  }
  try {
    const userContact = await userModel.findOne({ _id: req.useID });

    if (userContact) {
      await userContact.addMessage(name, email, mobile, message);
      userContact.save();
      res.status(201).json({ message: "User Message Suessfull" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User LogOut");
});
module.exports = router;
