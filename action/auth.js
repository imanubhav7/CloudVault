'use server'
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { signJWT } from "@/lib/helpers/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";


// Sign IN Fn
export const signIn = async(email) => {
   const {databases} = await createAdminClient();

   const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", email)]
   )

   if(existing.total === 0){
    throw new Error ("User not found. Please Sign up first")
   }
    const user = existing.documents[0];

    if(!user.verified){
      throw new Error ("Your account is not verified, Please sign up again")
    }

    // JWT token
    const token = signJWT({email:user.email,fullName:user.fullName,id:user.$id});
    
    cookies().set("session", token, {
      httpOnly: true,
      secure:true,
      path: '/',
      sameSite:"strict",
      maxAge: 3600,
    })

    return{success: true, message: "Signed in successfully"}
}

//Logout Fn
export const signOut = async() => {
    try {
      (await cookies()).delete("session");
       return {success: true, message: "Logged out" }
    } catch (error) {
       console.error("Logout failed", error) 
       throw new Error ("Failed to logout")
    }
    finally{
      redirect('/sign-in')
    }
}