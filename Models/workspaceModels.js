const mongoose= require("mongoose")

const workspaceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"],
        trim:true,
        maxLength:[50, "workspace name cannot exceed 50 characters"]
        
    },
    description:{
          type:String,
          trim:true,
          maxLength:[500, "Description cannot exceed 500 characters"]
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "workspace must have an owner"]
    },
    members:[{
          user:{
             required:true,
             type:mongoose.Schema.Types.ObjectId,
             ref:"User"
          },
          role:{
            type:String,
            enum:["admin", "member", "viewer"],
            default:"viewer"
          },
          joinedAt:{
            type:Date,
            default:Date.now
          }

        }],
        
    isPrivate:{
            type:Boolean,
            default:true
          }
          
},
{timestamps:true}
)

workspaceSchema.index({name:1, owner:1}, {unique:true})
workspaceSchema.index({"members.user":1})


workspaceSchema.methods.isMember= function(userId){
  if(!userId){
   return false
  }
  return this.members.some(
    member=>member?.user?.toString()===userId.toString()
  )
}

workspaceSchema.methods.isMemberByEmail= async function(email){
  if(!email){
    return false
  }
await this.populate("members.user", "email")
return this.members.some(
  member=>member.user?.email===email
)
}

workspaceSchema.methods.isAdmin = function(userId){
  for(let member of this.members){
    if(member.user.toString()===userId.toString()&&member.role==="admin")
      return true
  }
  return false
}
module.exports= mongoose.model("Workspace", workspaceSchema )