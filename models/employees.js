const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    firstname: {
        type: String,
        required: [true, "firstname is missing"],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "lastname is missing"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "username is missing"],
        unique: true, 
        trim: true, 
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email is missing"],
        trim: true, 
    },
    password: {
        type: String,
        required: [true, "password is missing"], 
        trim: true,
        minlength: [8, "password cannot be less than 8 characters"],
    },
    skills: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        maxlength: [10, "mobile number cannot be more than 10 numbers"],
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model("Node", EmployeeSchema);