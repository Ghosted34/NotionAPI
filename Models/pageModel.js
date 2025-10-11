const mongoose = require("mongoose")
const pageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    icon:{
        type:String,
        default:'📄'
    },
    cover:{
        type:String,
        default:null
    },
    blocks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Block"
    }],
    subPages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Page"
    }],
    parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page',
            required: false // Optional for root pages
        },
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:"true"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true"
    },
    lastModifiedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    isArchived:{
        type:Boolean,
        default:false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true,
        default: 0
    }

},
{
    timestamps: true

}

)

//indexes for efficient querying
pageSchema.index({workspace:1, parent:1})
pageSchema.index({workspace:1, createdBy:1})


pageSchema.methods.getChildPages= async function(){
    return await this.model("Page").find({parent:this._id}).sort(order)
}

pageSchema.methods.getAncestors= async function(){
   const ancestor =[]
   let currentPage=this  
   while(currentPage.parent){
    const page= await this.model("Page").findById(currentPage.parent)
    if(!parent) break
     ancestors.unshift(parent);
    currentPage = parent;
   }
    
    return ancestors;
}
pageSchema.methods.getFullPath=async function(){
    const ancestor=await  this.getAncestors()
    return[...ancestors,this].map(page=>page.title).join("/")
}
pageSchema.methods.moveTo =async function(newParentId, newOrder){
if(newParentId){
    const newParent= await this.model("Page").findById(newParentId)
}
if(!newParent){
    throw new Error ("The new Parent Page does not exist")
}
const ancestors=this.getAncestors
if(ancestors.some(ancestor=> ancestor._id.toString()===newParentId.toString()))
 throw new Error("")

   this.parent = newParentId;
    this.order = newOrder;
    await this.save();
}



module.exports = mongoose.model("Page", pageSchema)