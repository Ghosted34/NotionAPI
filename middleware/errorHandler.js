const CustomAPIError = require("../errors/customErrors")
const{StatusCodes}= require("http-status-codes")

const errorHandler=async(err,req, res,next)=>{
    if(err instanceof CustomAPIError){
       return res.status(err.statusCode).json(err.message)
    }
    return res.status(StatusCodes.BAD_REQUEST).json( err.message)
}


module.exports= errorHandler