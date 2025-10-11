const {StatusCodes} = require('http-status-codes');
const  CustomAPIError  = require('./customErrors');

class NotFoundError extends CustomAPIError {
  constructor(message, statusCode=StatusCodes.NOT_FOUND){ 
    super(message, statusCode)
   
  }
}


module.exports= NotFoundError