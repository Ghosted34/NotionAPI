const Block = require("../Models/Block")
const Page = require("../Models/pageModel")
const {StatusCodes}=require("http-status-codes")
const {CustomAPIError, AuthenticationError, badRequest, NotFoundError}  =require("../errors")
const workspace = require("../../Task-Man/Models/workspace")


const createPage= async(req,res, next)=>{
const{workspaceId}= req.params
const{title, icon, cover, blocks, pages, parents}=req.body
const page = await Page.create({
    title, 
    icon, 
    cover, 
    blocks, 
    pages, 
    parents, 
    workspace: workspaceId,
    createdBy:req.user._id,
    lastModifiedBy:req.user._id

})
if(!page){
    throw new NotFoundError("Could not create Page")
}
res.status(StatusCodes.CREATED).json(page)

}

const getPage= async(req, res, next)=>{
    const {id:pageId,workspaceId}= req.params

     const page= await Page.findOne({
        _id:pageId, 
        workspace:workspaceId
    }).populate("blocks")
    if(!page){
        throw  new badRequest("Page doesn't exist")
    }
   
    
    res.status(StatusCodes.OK).json({page})

  
}


const deletePage= async(req,res, next)=>{
    const {id:pageId, workspaceId}= req.params
    const page = await Page.findOne({
        _id:pageId,
        workspace:workspaceId})
    if(!page){
          throw  new NotFoundError("Page not Found")
    }

    await Block.deleteMany({parent:pageId, parentModel:"Page"})
    
    await page.deleteOne()
    res.status(StatusCodes.OK).json({msg:"Page deleted successfully"})
}

const updatePage= async(req,res,next)=>{   
    const {id:pageId,workspaceId}= req.params 
    const{title, icon, cover, isPublic, isArchived}= req.body
    const page= await Page.findOneAndUpdate({
        _id:pageId,
        workspace:workspaceId
     }, 
    {
    title,
    icon, 
    cover,
    isPublic,
    isArchived},
     {new:true,
    runValidators:true}
)

if(!page){
    throw new NotFoundError("Page not found")
}
res.status(StatusCodes.OK).json({page})
}
//create a new block

const createBlock= async(req,res,next)=>{
    const{type, content, order} =req.body
    const {id:parentId, workspaceId}= req.params
     const parentModel= await Block.determineParentModel(parentId)
    if(!parentModel){
        throw new badRequest("Parent not found")
    }

   // console.log(parentModel)
    const block= await Block.create({
        type,
        content,
        parent: parentId,
        parentModel,
        workspace:workspaceId,
        order,
        createdBy:req.user._id,
        lastModifiedBy:req.user._id
    })
 


    if(parentModel==="Page"){
        await Page.findByIdAndUpdate(block.parent, {
            $push:{blocks:block._id}
        })
    }
    res.status(StatusCodes.CREATED).json(block)
}

const updateBlock= async(req,res,next)=>{  
  const{id:blockId, workspaceId}= req.params;
  const{content, order}= req.body
  const block= await Block.findOneAndUpdate(
 
 {_id:blockId, workspace:workspaceId},
  {
    content,
     order,
    lastModifiedBy: req.user._id 
  },
  {
    new:true,
  runValidators:true}
  )
 if (!block) {
throw new NotFoundError(`Block with id ${blockId} not found`);
    }
res.status(StatusCodes.OK).json({ block });
}

const deleteBlock= async(req,res,next)=>{
    const{id:blockId, workspaceId}= req.params
    const block= await Block.findOne({_id:blockId, workspace:workspaceId})
   if(!block){
        throw new NotFoundError(`Block with id ${blockId} not found`);
    }
    const children= block.getChildren()
    console.log(children)
   /*const deleteChildren= async(blockId)=>{
   const children= block.getChildren()
   console.log(children)
   for (const child of children){
    await deleteChildren(child._id)
   }
    await Block.findByIdAndDelete(blockId) 
   } 
  
    await deleteChildren(blockId)

    if(block.parentModel==="Page"){
        await Page.findByIdAndUpdate(block.parent,{
            $pull:{blocks:block._id}
        })
    }*/

    
    res.status(StatusCodes.OK).json({msg:"Block deleted successfully"})
}

const moveBlock = async(req,res, next)=>{
    const {id:blockId, workspaceId} = req.params
    const {newParent, newParentModel, newOrder} = req.body

    const block= await Block.findOne({_id:blockId, workspace:workspaceId})
    await  block.moveTo(newParent, newParentModel, newOrder)
    res.status(StatusCodes.OK).json({block})
}


module.exports={createPage, getPage, deletePage, updatePage, createBlock, updateBlock, deleteBlock, moveBlock}