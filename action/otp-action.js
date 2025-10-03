'use server'
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { signJWT } from "@/lib/helpers/jwt";
import { sendOtpEmail } from "@/lib/helpers/mailer";
import { generateOtp } from "@/lib/helpers/otp";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import nodemailer from "nodemailer";

const otpStore = new Map();
// sendOTP FN
export const sendOTP = async (email , fullName, type='sign-up') => {
    
    const {databases} = await createAdminClient()
    const otp = String(generateOtp());
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000).toISOString();  //5MIn
  
  // Checking USer
   const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", email)]
  );

  if(type==='sign-up' && existing.total>0){
   
   
    const user = existing.documents[0];
    if(user.verified){
         throw new Error ("User already exists, Please Sign in")
    }
    else{
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {otp,otpExpires,verified:false}
        )
        await sendOtpEmail(email,otp)
        return{success: true, message: `OTP send to ${email}`}
    }

  }

  
  if (type === "sign-in" && existing.total === 0) {
    throw new Error("User not found. Please sign up first.");
  }



  if (existing.total > 0) {
    // update existing user
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      existing.documents[0].$id,
      { otp, otpExpires, verified: false,fullName: fullName || existing.documents[0].fullName || "" }
    );
  } else {
    // create new user
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {fullName, email, otp, otpExpires, verified: false }
    );
  }



  // Send OTP via mail
  await sendOtpEmail(email, otp);
  return { success: true, message: "OTP sent" };
};


// Verify OTP 
export const verifyOtp = async (email, otp) => {

    const {databases} = await createAdminClient()
      const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", email)]
  );

  if (result.total === 0) throw new Error("User not found");

  const user = result.documents[0];

  console.log("DEBUG → Stored OTP:", user.otp, "Entered OTP:", otp);
  console.log("DEBUG → Stored Expiry:", user.otpExpires, "Now:", new Date().toISOString());

  
  const storedOtp = String(user.otp).trim();
  const enteredOtp = String(otp).trim();

  if (storedOtp !== enteredOtp) {
    throw new Error("Invalid OTP");
  }

  if (new Date(user.otpExpires).getTime() < Date.now()) {
    throw new Error("Expired OTP");
  }
  // update verified status
  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    user.$id,
    { verified: true, otp: null, otpExpires: null }
  );


  const token = signJWT({ email: user.email,fullName: user.fullName , id: user.$id });
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 3600, // 1 hour
  });


  return {success:true,message: "OTP Verified", token}
};

