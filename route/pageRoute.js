const express= require("express")
const router= express.Router()
const {createPage, getPage, deletePage, updatePage, createBlock, updateBlock, deleteBlock, moveBlock}= require("../controller/page")
const {authMiddleware, ensureAuthenticated}   = require("../middleware/userAuth")
const  workspaceAuth= require("../middleware/workspaceAuth")



router.route("/workspace/:workspaceId").post(authMiddleware, workspaceAuth.requireWorkspaceMember, createPage)
router.route("/workspace/:workspaceId/pages/:id").get(authMiddleware, workspaceAuth.requireWorkspaceMember, getPage).delete(authMiddleware, workspaceAuth.requireWorkspaceMember, deletePage).patch(authMiddleware, workspaceAuth.requireWorkspaceMember, updatePage)
router.route("/:workspaceId/blocks/:id").post(authMiddleware, workspaceAuth.requireWorkspaceMember, createBlock)
router.route("/:workspaceId/blocks/:id").patch(authMiddleware, workspaceAuth.requireWorkspaceMember, updateBlock).delete(authMiddleware, workspaceAuth.requireWorkspaceMember, deleteBlock)



module.exports= router

