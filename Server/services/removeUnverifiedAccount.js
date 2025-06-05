import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccount = ()=>{
    cron.schedule("*/5 * * * *",async()=>{
        const thirtyMinuteAgo = new Date(Date.now() - 30*60*60*1000);
        await User.deleteMany({
            accountVerified : false,
            createdAt : {$lt: thirtyMinuteAgo},
        })
    })
}

