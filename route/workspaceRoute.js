const express =require("express")
const router= express.Router()
const {createWorkspace,getWorkspace, updateWorkspace, deleteWorkspace, addMember,updateRole, deleteMember, getAllWorkspaces}= require("../controller/workspaceController")
const userAuth =require("../middleware/userAuth")
const workspaceAuth = require("../middleware/workspaceAuth")

router.route("/").post(userAuth,createWorkspace).get(getAllWorkspaces)
router.route("/:id").patch(userAuth, workspaceAuth.requireWorkspaceAdmin, updateWorkspace).delete(userAuth, workspaceAuth.requireWorkspaceAdmin,deleteWorkspace).get(userAuth, workspaceAuth.requireWorkspaceMember, getWorkspace)
router.route("/:id/member").patch(userAuth,  workspaceAuth.requireWorkspaceAdmin, addMember).delete(userAuth, workspaceAuth.requireWorkspaceAdmin,deleteMember)
router.route("/:id/role").patch(userAuth,  workspaceAuth.requireWorkspaceAdmin , updateRole)



module.exports = router