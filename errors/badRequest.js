const CustomAPIError= require("./customErrors")
const {StatusCodes}= require("http-status-codes")

class BadRequest extends CustomAPIError{
    constructor(message="This is a Bad Request",  statusCodes=StatusCodes.BAD_REQUEST){
        super(message, statusCodes,)
    }
}


module.exports=BadRequest