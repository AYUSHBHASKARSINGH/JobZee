import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import {Job} from '../models/jobSchema.js';


export const getAllJobs = catchAsyncErrors(async(req,res,nest)=>{
    const jobs = await Job.find({expired :false});
    res.status(200).json({
        success: true,
        jobs,
    });

})


export const postJob = catchAsyncErrors(async(req,res,next)=>{
    // req.user from auth.js
    // const {role} = req.user; or
    const role = req.user.role;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resource",400));
    }

    const {title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo} = req.body;
    // console.log(`${title}`)
    // console.log(`${description}`)
    // console.log(`${category}`)
    // console.log(`${country}`)
    // console.log(`${location}`)

    if(!title || !description || !category || !country || !city || !location){
        return next(new ErrorHandler("Please provide complete job details",400));
    }

    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new ErrorHandler("Please provide either salary range or fixed salary!",400));
    }

    if(fixedSalary && salaryTo && salaryFrom){
        return enxt(new ErrorHandler("Please provide either range or fixed salary",400));
    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo,postedBy,
    });

    res.status(200).json({
        success:true,
        message: "Job posted successfully!",
        job
    })
})


export const getmyJobs = catchAsyncErrors(async(req,res,next)=>{
    const { role } = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resource",400));
    }

    const myJobs = await Job.find({
        postedBy: req.user._id
    });


    res.status(200).json({
        success:true,
        myJobs
    })
})



export const updateJob  = catchAsyncErrors(async(req,res,next)=>{
    const { role } = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resource",400));
    }

    const myJobs = await Job.find({
        postedBy: req.user._id
    });

    // us job ki id aa jayegi jo update krni h
    const {id} = req.params;

    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("OOps! Job not found",400));
    }

    job = await Job.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success:true,
        job,
        message: "Job updated successfully",
    })
})




export const deleteJob = catchAsyncErrors(async(req,res,next)=>{
    // console.log("Aya")
    const { role } = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resource",400));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("OOps! Job not found",400));
    }
    await job.deleteOne();
    res.status(200).json({
        success:true,
        message: "Job deleted successfully",
    })
});

export const getSinglejob = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    try{
        const job = await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job not found",400));
        }
        res.status(200).json({
            success:true,
            job
        })
    }catch(error){
        return next(new ErrorHandler("Invalid ID/ Cast Error",400));
    }
});