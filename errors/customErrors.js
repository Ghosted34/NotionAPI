const {StatusCodes}= require("http-status-codes")


class CustomAPIError extends Error{
    constructor(message, statuscode=StatusCodes.INTERNAL_SERVER_ERROR, errorCode ){
        super(message)
        this.name= this.constructor.name
        this.errorCode=errorCode|| "UNKNOWN_ERROR"
        this.timestamp= new Date().toISOString()
        this.isOperational= true
        this.statusCode=statuscode
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports=CustomAPIError