const Workspace = require("../Models/workspaceModels")
const User = require("../Models/userModels")
const {StatusCodes}= require("http-status-codes")
const {CustomAPIError, AuthenticationError, badRequest} = require("../errors")



const createWorkspace= async(req,res,next)=>{
    const{name, description} = req.body
    if(!name||!description){
      throw new CustomAPIError("Please enter a name and description for your workspace", StatusCodes.BAD_REQUEST)
    }
    console.log(name, description)

    
     const workspace = await Workspace.create({
         name,
         description,
         owner:req.user._id,
         members:[{user:req.user._id, role:"admin"}]
    })

    // console.log(error.message)

   // console.log()

   if(!workspace){

     throw new CustomAPIError("Could not create workspace", StatusCodes.BAD_REQUEST)
   }
   
   res.status(StatusCodes.CREATED).json(workspace)
}

const getWorkspace =async(req,res, next)=>{
     const workspaceId =req.params.id
     console.log(workspaceId)
     const workspace= await Workspace.findOne({
          _id:workspaceId,
          "members.user":req.user._id 
     }).populate("members.user")
     res.status(StatusCodes.OK).json(workspace)
}
const updateWorkspace= async(req, res)=>{
     const{name, description, isPrivate }= req.body
     const workspaceId = req.params.id
     const workspace = await Workspace.findOne({
          _id:workspaceId,
          "members.user":req.user._id})
 /*if(!(workspace.owner._id.toString()===req.user._id.toString()||workspace.isAdmin(req.user._id))){
     throw new AuthenticationError("User is not authorized to update Workspace")
 }*/

workspace.name = name,
workspace.description=description,
workspace.isPrivate= isPrivate

 await workspace.save()
    
res.status(StatusCodes.OK).json(workspace)}




const getAllWorkspaces = async(req,res)=>{
     const allWorkspaces= await Workspace.find({})
     if(allWorkspaces===0){
          throw new CustomAPIError("No workspace has been added")
     }
     res.status(StatusCodes.OK).json(allWorkspaces)
}
const deleteWorkspace= async(req, res)=>{
     const workspaceId = req.params.id
     const workspace = await Workspace.findOne({
     _id:workspaceId,
     "members.user":req.user._id})

     if(!(workspace.owner._id.toString()===req.user._id.toString()||workspace.isAdmin(req.user._id))){
          throw new AuthenticationError("User is not authorized to update Workspace")
      }

      await workspace.deleteOne()
     res.status(StatusCodes.OK).json({msg:"This workspace has been deleted"})
}


const addMember = async(req, res, next)=>{
 const workspaceId= req.params.id
 const{email, role}= req.body
 const Inviteduser = await User.findOne({email})
if(!Inviteduser){
   throw new badRequest("User does not exist", StatusCodes.BAD_REQUEST)
}
const workspace = await Workspace.findOne(
     {
          _id:workspaceId,
          "members.user":req.user._id
     }).populate("members.user")

/*if(!(workspace.owner._id.toString()===req.user._id.toString()||workspace.isAdmin(req.user._id))){
     throw new AuthenticationError("User is not authorized to add Members to Workspace")
 }*/

if( await workspace.isMemberByEmail(email))
{
     throw new CustomAPIError("User already on the workspace", StatusCodes.BAD_REQUEST)
}
 workspace.members.push({
     user:Inviteduser._id,
     role:role
 })
 await workspace.save()
res.status(StatusCodes.OK).json(workspace)
}


const deleteMember = async(req,res,next)=>{
     const workspaceId= req.params.id
     const{email}= req.body
     

     const workspace = await Workspace.findOne(
          {
               _id:workspaceId,
               "members.user":req.user._id
          }).populate("members.user")

     const userToRemove = await User.findOne({email})
  
    if(!userToRemove){
     throw new badRequest("This user does not exist")
    }
     const isMember = workspace.members.some(
          (m)=> m.user?._id?.toString() === userToRemove._id.toString()
     )
  
     if (!isMember) {
          throw new badRequest("User is not in this workspace");
        }

        console.log(isMember) 
 /*if(!(workspace.owner._id.toString()===req.user._id.toString()||workspace.isAdmin(req.user._id))){
          throw new AuthenticationError("User is not authorized to add Members to Workspace")
      }*/


if (workspace.owner._id.toString()==userToRemove._id.toString()|| workspace.isAdmin(userToRemove._id)){
   throw new badRequest("Cannot remove owner or admin", StatusCodes.BAD_REQUEST)
}
//console.log()
workspace.members = workspace.members.filter(
     (m) => m.user._id.toString() !== userToRemove._id.toString()
   );
await workspace.save()
res.status(StatusCodes.OK).json(workspace)
}




const updateRole= async(req,res, next)=>{
     const {id:workspaceId}=req.params
     const {email, role}= req.body
     const userToUpdate = await User.findOne({email})
     const workspace = await Workspace.findOne({_id:workspaceId, "members.user":req.user._id})
     
    /* if (!(workspace.owner.toString()===req.user._id.toString())){
        // return next(new (AuthenticationError("Not Authorized to change permission in workspace")))
        throw new AuthenticationError("Not authorized to change permissions")
     }*/
     if (workspace.owner.toString()===userToUpdate._id.toString()){
         throw new AuthenticationError("not authorized to change  role  of user ")
     }
     const memberIndex= workspace.members.findIndex(
         member=> member.user.toString()===userId
     )
     
     if(memberIndex===-1){
         //return next(createCustomError("user is not a member of workspace"))
         throw new createCustomError("user is not a member of workspace")
     }
     workspace.members[memberIndex].role = role
     await workspace.save();
     
     const updatedWorkspace = await Workspace.findOne({ _id: workspaceId })
         .populate("owner", "name email")
         .populate("members.user", "name email");
     
     res.status(StatusCodes.OK).json({ workspace: updatedWorkspace });
     }
     

module.exports= {createWorkspace,getWorkspace, updateWorkspace, deleteWorkspace, addMember,updateRole, deleteMember, getAllWorkspaces}