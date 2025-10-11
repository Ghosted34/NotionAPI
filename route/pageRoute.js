const express= require("express")
const router= express.Router()
const {createPage, getPage, deletePage, updatePage, createBlock, updateBlock, deleteBlock, moveBlock}= require("../controller/page")
const userAuth = require("../middleware/userAuth")
const  workspaceAuth= require("../middleware/workspaceAuth")



router.route("/workspace/:workspaceId").post(userAuth, workspaceAuth.requireWorkspaceMember, createPage)
router.route("/workspace/:workspaceId/pages/:id").get(userAuth, workspaceAuth.requireWorkspaceMember, getPage).delete(userAuth, workspaceAuth.requireWorkspaceMember, deletePage).patch(userAuth, workspaceAuth.requireWorkspaceMember, updatePage)
router.route("/:workspaceId/blocks/:id").post(userAuth, workspaceAuth.requireWorkspaceMember, createBlock)
router.route("/:workspaceId/blocks/:id").patch(userAuth, workspaceAuth.requireWorkspaceMember, updateBlock).delete(userAuth, workspaceAuth.requireWorkspaceMember, deleteBlock)



module.exports= router

