const bcrypt = require("bcryptjs");
const Node = require("../models/employees");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const sendResetPasswordMail = async(name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p> Hii '+name+', Please copy the link and <a href = "http://localhost:3003/api/employees/reset-password?token = '+token+' "> reset your password </a>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if (error) {
                console.log(error);
            }
            else {
                console.log("Mail has been sent:-", info.response);
            }
        });
    } 
    catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}




const employeeList = async (req,res) => {
    try {
        const users = await Node.find({});
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ msg: err });
    }
};
const employeeSignup = async (req,res) => {
    try {
        const salt = await bcrypt.genSalt(10);
       
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
      
        const user = await Node.create({
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            skills: req.body.skills,
            dob: req.body.dob,
            phone: req.body.phone,
            country: req.body.country,
            state: req.body.state
        }); 
        const result = await user.save();
        const { password, ...data } =  result.toJSON();
        res
        .send(data)
        .status(201);
    }
    catch (err) {
        res.status(500).json({ msg: err });
    }
};
const employeeLogin = async (req,res) => {
    try {
        const { email } = req.body;
        const user = await Node.findOne({ email });
        
        if (!user) {
            return res
            .status(404)
            .json({ msg: `User not available with the email id: ${ email }` });
        }
        if (!await bcrypt.compare(req.body.password, user.password)) {
                return res
                .status(400)
                .send({ msg: `invalid password` });
        }
        const token = jwt.sign({_id: user._id}, "secret");
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.status(201).json({ msg: "success", data:token });
               
    }
    catch (err) {
        res.status(500).json({ msg: err });
    }
};
const getUser = async (req,res) => {
    try {
        const cookie = req.cookies["jwt"];
        const claims = jwt.verify(cookie, "secret"); 
        if (!claims) {
            return res
            .status(401)
            .send({ msg: "unauthenticated" })
        }
        const user = await Node.findOne({_id: claims._id });
        const {password, ...data} = await user.toJSON();
        res.send(data);
    }
    catch (e) {
        return res
        .status(401)
        .send({ msg: "unauthenticated" })
    }  
};
const employeeLogout =  (req,res) => {
    res.cookie("jwt", "", {maxAge: 0})
    res.send({ msg: "succes" });
};

//forgetpassword
const forgetPassword = async(req,res) => {
    try {
        const email = req.body.email;
        const userData = await Node.findOne({email:email});
        if (userData) {
            const randomString = randomstring.generate();
            const data = await Node.updateOne({email:email}, {$set:{token:randomString}});
            sendResetPasswordMail(userData.firstname,userData.email,randomString);
            res.status(200).send({success:true, msg:`http://localhost:3003/api/employees/reset-password?token=${randomString}`});
        }
        else {
            res.status(200).send({success:true, msg:"This email does not exists."}); 
        }
    }
    catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

//resetpassword
const resetPassword = async(req,res) => {
    try {
        const token = req.query.token;
        const tokenData = await Node.findOne({ token:token });
        if (tokenData){
            const password = req.body.password;
            const newPassword = await hashedPassword(password);
            const userData = await Node.findByIdAndUpdate({ _id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true});
            res.status(200).send({success:true, msg:"User Password has been reset.",data:userData});
        }
        else {
            res.status(200).send({success:true, msg:"This link has been expired."});
        }
    } 
    catch (error) {
        res.status(400).send({success:false, msg:error.message}); 
    }
}

module.exports = {
    employeeList,
    employeeSignup,
    employeeLogin,
    getUser,
    employeeLogout,
    forgetPassword,
    resetPassword,
};