import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "JOB_SEEKING_WEBSITE"
    }).then(()=>{
        console.log("Connected to database")
    }).catch((err)=>{
        console.log(`some error occur while connecting to database: ${err}`);
    })
}