// after changing type = module in package.json
import express from "express";
import dotenv from "dotenv";
// to connect backend to frontend
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import userRouter from "./routes/userRouter.js"
import applicationRouter from "./routes/applicationRouter.js"
import jobRouter from "./routes/jobRouter.js"

import {dbConnection} from "./database/dbconnection.js"
import {errorMiddleware} from "./middlewares/error.js"


const app = express();
// server port defined in config.env
dotenv.config({path: "./config/config.env"})


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET","POST","DELETE","PUT"],
    credentials: true,
}))


// cookie parser sbse phle
app.use(cookieParser());

// used to onlu parse json data baki data neglect
app.use(express.json());
// string provide krenge to json kr dega
app.use(express.urlencoded({extended: true}));


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))



app.use('/api/v1/user',userRouter);
app.use('/api/v1/job',jobRouter);
app.use('/api/v1/application',applicationRouter);



// NOW DB CONNECTION

dbConnection();





// error middleware use in end
app.use(errorMiddleware)
export default app;



