import express from "express";
import {deleteJob, getAllJobs, getmyJobs, getSinglejob, postJob, updateJob } from '../controllers/jobController.js'
import {isAuthorised} from '../middlewares/auth.js'


const router = express.Router();
router.get("/getall",getAllJobs);

// isauthorised phle run hoga then postjob and post job tbhi run hoga jb user authorised hoga
// mtlb user should be loginned
router.post("/post",isAuthorised,postJob);

router.get("/getmyJobs",isAuthorised,getmyJobs);


// put for update
// it will carry a param with it to identify konsi update krni h like /asjndalnsd
// yha id likha h to jobcontroller m bhi id hi get krega agr abcd likha to udhr bhi abcd likhna
router.put("/update/:id",isAuthorised,updateJob);


router.delete("/delete/:id",isAuthorised,deleteJob);
router.get("/:id",isAuthorised,getSinglejob)

export default router;