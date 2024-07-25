import express from "express";
import {employerGetAllApplications,jobseekerDeleteApplications,jobseekerGetAllApplications, postApplication} from "../controllers/applicationController.js"
import {isAuthorised} from "../middlewares/auth.js"


const router = express.Router();

router.get("/employer/getAll", isAuthorised,employerGetAllApplications);
router.get("/jobseeker/getAll", isAuthorised,jobseekerGetAllApplications);

router.delete("/delete/:id", isAuthorised,jobseekerDeleteApplications);

router.post("/post",isAuthorised,postApplication)


export default router;