import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js"
import cloudinary from 'cloudinary';
import { Job } from '../models/jobSchema.js';


export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job seeker is not allowed to access this resource", 400));
    }

    const { _id } = req.user;
    const applications = await Application.find({ 'employerId.user': _id });

    res.status(200).json({
        success: true,
        applications
    })
});


export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }

    const { _id } = req.user;
    // applicantId jo application schema me define kri 
    const applications = await Application.find({ 'applicantId.user': _id });

    res.status(200).json({
        success: true,
        applications
    })
});


export const jobseekerDeleteApplications = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }
    // params me application ki id
    const { id } = req.params;
    // applicantId jo application schema me define kri 
    const applications = await Application.findById(id);

    if (!applications) {
        return next(new ErrorHandler("Oops! Application not found"));
    }

    await applications.deleteOne(id);

    res.status(200).json({
        success: true,
        message: "Application deleted succesfully",
    })
});





// bit complex

export const postApplication = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.body)
    const { role } = req.user;

    
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }

    // nhi smjha
    if (!req.files || !Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume file required!"));
    }
    // const resume = req.files.resume or
    const { resume } = req.files;


    // using png for resume as cloudinary cant allow to access pdf on frontend we can send but not see 
    const allowedFormats = ["image/png", "image/jpg", "image/webp"];
    // mimetype eg png or jpg etc.
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler("Please upload your resume in png or jpg or webp format!", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );

    // console.log(cloudinaryResponse);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary error: ", cloudinaryResponse.error || "Unknown error");

        return next(new ErrorHandler("Failed to upload Resume!", 400));
    }

    // now baki ki cheeze except resume

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantId = {
        user: req.user._id,
        role: "Job Seeker"
    };

    if (!jobId) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    const employerId = {
        user: jobDetails.postedBy,
        role: "Employer",
    }

    if (!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !resume) {
        return next(new ErrorHandler("Please fill all fields!", 400));
    }

    const application = await Application.create({
        name, email, coverLetter, phone, address, applicantId,employerId,
        resume: {
            // schema m aise hi bnaya hto aise hi denge
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });


    res.status(200).json({
        success: true,
        message: "Application submitted",
        application,
    });

})