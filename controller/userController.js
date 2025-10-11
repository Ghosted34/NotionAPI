require("dotenv").config()
const User= require("../Models/userModels")
const {CustomAPIError, AuthenticationError} = require("../errors")
const {StatusCodes}= require("http-status-codes")
const jwt = require("jsonwebtoken")

const createUser= async(req,res)=>{
     const{name, email, password}= req.body
     const alreadyExists= await User.findOne({email})
     if(alreadyExists){
        throw new CustomAPIError("This user already exists", StatusCodes.CONFLICT)
     }
      const user= await User.create({
        name,
        email,
        password
      })
      if(!user){
        throw new AuthenticationError("Could not create user")
      }
      res.status(StatusCodes.CREATED).json({msg:"User successfully created!"})
    }
const getAllUsers = async(req,res)=>{
  const users = await User.find({})
  if(!users){
    throw new CustomAPIError("Could not highlight users", StatusCodes.BAD_REQUEST)
  }
  res.status(StatusCodes.OK).json(users)
}
const userLogin = async(req, res)=>{
    const {email, password}= req.body
    const user= await User.findOne({email})
    if(!user){
        throw new CustomAPIError("This user does not exist", StatusCodes.BAD_GATEWAY)
    }
    const isMatch= await user.validatePassword(password)
    if(!isMatch){
        throw new AuthenticationError("invalid sign-in credentials")
    }
    const token = jwt.sign({
      userId: user._id},
    process.env.TOKEN,
    {expiresIn:"20d"})
    res.status(StatusCodes.OK).json({msg:"login successful", token})
}

const googleSuccess= (req,res)=>{
  if(!req.user){
    return res.redirect("/api/v1/users/auth/failure")
  }
  res.status(StatusCodes.OK).json({
    msg:"login successful",
    user:req.user
  })
  }

  
const googleFailure= (req,res)=>{
  res.status(StatusCodes.UNAUTHORIZED).json({msg: "Google authentication failed" })
}

module.exports={createUser, getAllUsers, userLogin, googleSuccess, googleFailure  }