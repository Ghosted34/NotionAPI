const mongoose = require("mongoose")
const bcrypt= require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"],
        trim:true,
        //unique:true,
    },
    googleId:{
        type:String,
        sparse:true,
        unique:true
    },
    authProvider:{
         type:String,
         enum:["google", "local"],
         default:"local"
    },
    email:{
        type:String,
        required:[true, "email is required"],
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        //required:[true, "password is required"],
        trim:true,
        unique:true
    }
})


userSchema.pre("save", async function(next){
         if(!this.isModified("password"))
            return next()
        if(!this.password) return next()
         try{
            const SALT_ROUNDS=10
            this.password= await bcrypt.hash(this.password, SALT_ROUNDS)
            return next()
         }
         catch(err){
             next(err)
         }
})

userSchema.methods.validatePassword= function(data){
    if(!this.password) {
        throw new Error("Password not set for this user")
    }
    return bcrypt.compare(data, this.password)
}

module.exports=mongoose.model("User", userSchema)
