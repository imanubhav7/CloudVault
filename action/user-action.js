import { verifyJwt } from "@/lib/helpers/jwt";

import { cookies } from "next/headers";


export const getCurrentUser = async() => {
   const token = (await cookies()).get('session')?.value
   if(!token) return null;

   const decoded = verifyJwt(token)
   if(!decoded) return null
    try {
        
        return {email: decoded.email, fullName: decoded.fullName}
    } catch (error) {
        return null
    }
}