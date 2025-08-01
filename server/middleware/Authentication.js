import jwt from "jsonwebtoken";
import { secret } from "../controllers/main.js";

function authenticateToken(req, res, next) {
    const token = req.cookies.auth;
    //console.log("Authentication middleware triggered", req.cookies);
    //console.log("Token received:", token);
    if(!token){

        const error =  new Error("Un-Authenticated");
        error.code = 404;
        throw error
    }
    else{
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                const error =  new Error("Un-Authenticated");
                error.code = 404
                throw error
            }
            //console.log("User authenticated:", user);
            req.user = user;
            next();
        });
    }
}

export default authenticateToken;