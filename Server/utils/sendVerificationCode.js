import { generateVerifiactionOtpEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerifiacationcode(verificationCode,email,res){
    try{
        const message = generateVerifiactionOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject : "Verification code of BookWorm Library",
            message
        });

        res.status(200).json({
            success : true,
            message : "Verifiacation code sent successfully"
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Verifiacation code send failed"
        })
    }
}