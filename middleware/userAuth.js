const config = require("../config/index")
const jwt = require("jsonwebtoken")

const {CustomAPIError, AuthenticationError} = require("../errors")
const {StatusCodes}=require("http-status-codes")
const User = require("../Models/userModels")


const authMiddleware= async(req,res, next)=>{
    const authHeader =req.headers.authorization
    if(!authHeader?.startsWith("Bearer")){
        return next(new AuthenticationError("No token provided"))
    }
    const token = authHeader.split(" ")[1]
    try{
        const decoded= jwt.verify(token,  config.jwt.secret)
        const user = await  User.findById(decoded.userId)
        if(!user){
            throw new AuthenticationError("User not found", StatusCodes.UNAUTHORIZED)
        }
    
        req.user={
            _id:user._id,
            email:user.email,
           
        }
        next()
    }
    
    catch(err){
        return next(
            err.name==="TokenExpiredError"
            ? new AuthenticationError("Token expired", StatusCodes.UNAUTHORIZED)
            : new AuthenticationError("Invalid token", StatusCodes.UNAUTHORIZED)
        )
    }
}

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("Authenticated user:", req.user);
        return next();

    }
    res.status(401).json({ message: 'Unauthorized' });
}

module.exports= {authMiddleware, ensureAuthenticated}   
