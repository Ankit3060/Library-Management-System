import mongoose from "mongoose";

export const connectDB = async ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "LIBRARY_MANAGEMENT_SYSTEM"
    }).then(()=>{
        console.log(`Database connected successfully`);
    }).catch(err=>{
        console.log(`error in conncecting to database `,err)
    })
}