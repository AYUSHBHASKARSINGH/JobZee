import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Please provide job Title"],
        minLength: [3,"Job title must contain at least 3 characters"],
        maxLength: [50, "Job title cannot contain more than 50 characters"]
    },
    description:{
        type: String,
        required:[true,"Please provide job description"],
        minLength: [10,"Job description must contain at least 10 characters"],
        maxLength: [450, "Job description cannot contain more than 50 characters"]
    },

    category: {
        type: String,
        required: [true,"Job category is required"],
    },

    country: {
        type: String,
        required: [true,"Country is required"],
    },

    city: {
        type: String,
        required: [true,"Job city is required"],
    },

    location:{
        type: String,
        required: [true,"Please provide exact Job location!"],
    },

    fixedSalary: {
        type: Number,
        minLength: [4,"Fixed salary must contain atleast 4 digits!"],
        maxLength: [9, "Fixed salary cant exceed 9 digits"],
    },

    salaryFrom: {
        type: Number,
        minLength: [4,"salary from must contain atleast 4 digits!"],
        maxLength: [9, "salary from cant exceed 9 digits"],
    },

    salaryTo: {
        type: Number,
        minLength: [4,"salary to must contain atleast 4 digits!"],
        maxLength: [9, "salary to cant exceed 9 digits"],
    },

    expired: {
        type: Boolean,
        default: false,
    },

    jobPostedOn: {
        type: Date,
        default: Date.now(),
    },

    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },

});


export const Job = mongoose.model("Job",jobSchema);