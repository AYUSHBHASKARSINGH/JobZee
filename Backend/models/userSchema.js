import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3,"Name must contain at least 3 characters"],
        maxLength: [30,"Name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true,"Please provide your email !"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone:{
        type: Number,
        required: [true,"Please provide your phone number"],
    },
    password:{
        type: String,
        required: [true, "Please provide your password!"],
        minLength: [8,"Name must contain at least 8 characters"],
        maxLength: [32,"Name cannot exceed 32 characters"],
        // password response m nhi ayega issey
        select: false,
    },
    role:{
        type: String,
        required: [true, "Please provide your Role!"],
        // in do ke alava kuch aur role nhi hoga
        enum: ["Job Seeker", "Employer"],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// HASHING THE PASSWORD before userSchema if password is made
// user schema save hone se phle ye check krega
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    // 10 is level of encryption
    this.password = await bcrypt.hash(this.password, 10);
});


// COMPARING PASSWORD DECODE THE HASH

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};


// GENERATING JSON WEB TOKEN FOR AUTHORIZATION

userSchema.methods.getJWTToken = function(){
    // _id wo id jo jb user create hoga to mongodb dega usko
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });
};


export const User = mongoose.model("User",userSchema);