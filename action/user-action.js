import { verifyJwt } from "@/lib/helpers/jwt";

import { cookies } from "next/headers";


export const getCurrentUser = async() => {
   const token = (await cookies()).get('session')?.value
   if(!token) return null;

   try {
        const decoded = verifyJwt(token)
        if(!decoded) return null
        
        return {email: decoded.email, fullName: decoded.fullName , id:decoded.id}
    } catch (error) {
        return null
    }
}