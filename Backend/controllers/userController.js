// 3 methods for user ki user login kre register kre logout kre

import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return next(new ErrorHandler("Please fill full form!"));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return next(new ErrorHandler("Email already registered!"));
    }
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    sendToken(user,201,res,"User registered succesfully");
    // res.status(200).json({
    //   success: true,
    //   message: "User registered",
    //   user
    // });

  });



export const login = catchAsyncErrors(async(req,res,next)=>{
  const {email,password,role} = req.body;

  // console.log(email)
  // console.log(password)
  // console.log(role)

  if(!email || !password || !role){
    return next(new ErrorHandler("Please provide email, password and role",400));
  }

  const user = await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  if(user.role!=role){
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }

  sendToken(user,201,res,"User logged in succesfully!");
  
})


// cookie m jo token store hua h use delete krna h
export const logout = catchAsyncErrors(async(req,res,next)=>{
  // cookie token ko null kr diya
  res.status(201).cookie("token","",{
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "User logged out successfully!"
  });
})



export const getUser = catchAsyncErrors(async(req,res,next)=>{
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
})