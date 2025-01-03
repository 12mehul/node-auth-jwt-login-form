const express = require("express");
const {
  employeeList,
  employeeSignup,
  employeeLogin,
  getUser,
  employeeLogout,
  forgetPassword,
  resetPassword,
} = require("../controllers/employees");

const router = express.Router();

//list
router.route("/list").get(employeeList);

//signup
router.route("/signup").post(employeeSignup);

//login
router.route("/login").post(employeeLogin);
router.route("/").get(getUser);

//logout
router.route("/logout").post(employeeLogout);

//forgetpassword
router.route("/forget-password").post(forgetPassword);

//resetpassword
router.route("/reset-password").get(resetPassword);

module.exports = router;
