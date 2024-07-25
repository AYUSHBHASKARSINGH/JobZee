import ErrorHandler from "./error.js"
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import jwt from "jsonwebtoken"
import {User} from '../models/userSchema.js'

export const isAuthorised = catchAsyncErrors(async(req,res,next)=>{
    // token ka jo bhi naam m dunga utils me cookies bnate wqt
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("User not authorised",400))
    }

    // compare ki jo token  wo apne secret key wale se hi define hua h ya khi aur se
    // decoded me pura user save ho jayega
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);
    next();
});

