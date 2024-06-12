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
router.route("/employee-list").get(employeeList);

//signup
router.route("/employee-signup").post(employeeSignup);

//login
router.route("/employee-login").post(employeeLogin);
router.route("/user").get(getUser);

//logout
router.route("/employee-logout").post(employeeLogout);

//forgetpassword
router.route("/forget-password").post(forgetPassword);

//resetpassword
router.route("/reset-password").get(resetPassword);

module.exports = router;