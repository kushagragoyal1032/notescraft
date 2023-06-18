const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "kkgoyal";

// ROUTE:1 Create a user using post "/api/auth/createuser" - no login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors here then it return bad request and errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check email exist already or not
    try {
      let user = await User.findOne({ email: req.body.email }); // get all user info by email
      if (user) {
        return res
          .status(400)
          .json({success, errors: "Sorry this email is already exist!!" });
      }

      // excrypted the password...
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // this use for show data in response
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!");
    }
  }
);

// ROUTE:2 Authenticate a user using post "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors here then it return bad request and errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // here we are using "destructuring"
    try {
      let user = await User.findOne({ email }); // get all user info by email
      if (!user) {
        return res
          .status(400)
          .json({ success, errors: "Please login with correct with creds!!" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res
          .status(400)
          .json({ success, errors: "Please login with correct with creds!!" });
      }

      // this use for show data in response
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!!");
    }
  }
);

// ROUTE:3 Get loggedin user details using post "/api/auth/getuser" - login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // here excluding the password field
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!!");
  }
});

module.exports = router;
