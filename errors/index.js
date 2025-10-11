const CustomAPIError = require("./customErrors.js")
const badRequest = require("./badRequest.js")
const AuthenticationError = require("./authErrors.js")
const NotFoundError = require("./notFound.js")


module.exports= {CustomAPIError, AuthenticationError, badRequest, NotFoundError}   