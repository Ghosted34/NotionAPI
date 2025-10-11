const Workspace = require("../Models/workspaceModels")
const {CustomAPIError, AuthenticationError} = require("../errors")
const {StatusCodes}= require("http-status-codes")


const validateWorkspaceAccess= (requiredRole="member")=>{
    return async(req,res,next)=>{
    const workspaceId= req.params.workspaceId
    if(!workspaceId){
        return next(new CustomAPIError("Workspace ID is required"))
    }
    const workspace = await Workspace.findOne({
        _id:workspaceId,
         "members.user": req.user._id
        })
    console.log("members.user: ", req.user._id.toString())
    if(!workspace){
        throw new CustomAPIError("This workspace does not exist", StatusCodes.BAD_REQUEST)
    }

    const member = workspace.members.find(m=>m.user.toString()===req.user._id.toString())
 if(!member){
  throw new AuthenticationError("you are not a member of this workspace",StatusCodes.FORBIDDEN)
 }

 const roleHierarchy={
    "owner":4,
    "admin":3,
    "member":2,
    "viewer":1
 }

 const requiredRolelevel= roleHierarchy[requiredRole]
 const userRoleLevel = roleHierarchy[member.role]
 if (userRoleLevel===undefined){
   return next(new BadRequest(`Invalid role "${member.role}" in membership`))
 }


if (userRoleLevel< requiredRolelevel){
 return next(new AuthenticationError(`This action requires ${requiredRole} role or higher`))

}
next()
    }
}

const workspaceAuth={
    requireWorkspaceOwner:validateWorkspaceAccess("owner"),
    requireWorkspaceAdmin:validateWorkspaceAccess("admin"),
    requireWorkspaceMember:validateWorkspaceAccess("member"),
    requireWorkspaceViewer:validateWorkspaceAccess("viewer")
}


module.exports= workspaceAuth