import { verifyJwt } from "@/lib/helpers/jwt"
import { cookies } from "next/headers"

export const GET = async() => {
//Reading JWT
    const token = (await cookies()).get('session')?.value

    if(!token){
        return Response.json({user: null},{status: 401})
    }

   // Verifing JWT
   
   const payload = verifyJwt(token)
   if(!payload){
    return Response.json({user: null},{status: 401})
    
   }

   return Response.json({user:{email: payload.email}})
}