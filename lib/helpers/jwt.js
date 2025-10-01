import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const signJWT =(payload)=>{
return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'})
}

export const verifyJwt =(token) => {
    try {
       return jwt.verify(token, JWT_SECRET) 
    } catch (error) {
        console.log(error, "Token not verified")
        throw error
        return null;
    }
}