import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
})

export const sendOtpEmail = async(to,otp) => {
    const mailOptions={
        from: `"CloudVault" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP Code is : ${otp} `,
        html: `<h2> Your OTP code is : </h2> <b>${otp}</b>`
    }
    return  transporter.sendMail(mailOptions);
}
