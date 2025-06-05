import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUser = ()=>{
    cron.schedule("*/30 * * * *",async()=>{
        try {
            const oneDayAgo = new Date(Date.now() - 24*60*60*1000);
            const borrowers = await Borrow.find({
                dueDate : {
                    $lt : oneDayAgo
                },
                returnDate : null,
                notified : false,
            })

            for(const element of borrowers){
                if(element.user && element.user.email){
                    sendEmail({
                        email : element.user.email,
                        subject : "Book return Remainder",
                        message : `Hello ${element.user.name}, \n\n This is a remainder to return the pending book `
                    });

                    element.notified = true;
                    await element.save();
                    // console.log(`email send to ${element.user.email}`);
                }
            }
        } catch (error) {
            console.error("some error occur while notifying the user",err)
        }
    })
}