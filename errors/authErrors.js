const CustomAPIError = require("./customErrors")
const {StatusCodes} =require("http-status-codes")

class AuthenticationError extends CustomAPIError{
    constructor(message="Authentication failed", statusCode=StatusCodes.UNAUTHORIZED, errorCode="AUTH_ERROR"){
        super(message, statusCode, errorCode)
    }

}

module.exports= AuthenticationError