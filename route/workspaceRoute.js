const express =require("express")
const router= express.Router()
const {createWorkspace,getWorkspace, updateWorkspace, deleteWorkspace, addMember,updateRole, deleteMember, getAllWorkspaces}= require("../controller/workspaceController")
const {authMiddleware, ensureAuthenticated}  =require("../middleware/userAuth")
const workspaceAuth = require("../middleware/workspaceAuth")

router.route("/").post(authMiddleware,createWorkspace).get(getAllWorkspaces)
router.route("/:id").patch(authMiddleware, workspaceAuth.requireWorkspaceAdmin, updateWorkspace).delete(authMiddleware, workspaceAuth.requireWorkspaceAdmin,deleteWorkspace).get(authMiddleware, workspaceAuth.requireWorkspaceMember, getWorkspace)
router.route("/:id/member").patch(authMiddleware,  workspaceAuth.requireWorkspaceAdmin, addMember).delete(authMiddleware, workspaceAuth.requireWorkspaceAdmin,deleteMember)
router.route("/:id/role").patch(authMiddleware,  workspaceAuth.requireWorkspaceAdmin , updateRole)



module.exports = router