const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['text', 'image', 'checkbox', 'page', 'heading', 'code', 'quote', 'list'],
        default: 'text'
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    // For text blocks, content will be a string
    // For images, content will be {url: string, alt: string}
    // For checkboxes, content will be {checked: boolean, text: string}
    // For pages, content will be a reference to the page
    // For lists, content will be an array of items
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"workspace",
        required:true,

    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'parentModel',
        required: false // Optional for root blocks
    },
    parentModel: {
        type: String,
        enum: ['Page', 'Block'],
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block'
    }],
    order: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

blockSchema.index({ parent: 1, parentModel: 1 });

blockSchema.methods.isLeaf= function(){
    return this.children.length===0
}

blockSchema.methods.getdepth=  async function(){
    let depth=0
    let currentBlock=this
    while(currentBlock.parent){
        depth++
        currentBlock= await Block.findById(currentBlock.parent)
    }
    return depth
}
blockSchema.methods.getChildren = async function(){
    return await this.model("Block").find({parent:this._id})
}
blockSchema.methods.getAncestors = async function() {
    const ancestors = [];
    let currentBlock = this;
    
    while (currentBlock.parent) {
        const parent = await this.model('Block').findById(currentBlock.parent);
        if (!parent) break;
        ancestors.unshift(parent);
        currentBlock = parent;
    }
    
    return ancestors;
};

blockSchema.methods.moveTo = async function(newParentId,  newOrder) {
    if(!newParentId){
       return false
      
    }

    this.parent = newParentId;
    this.order = newOrder;
    await this.save();
};
blockSchema.statics.determineParentModel= async function(parentId){
    if(!parentId){
        throw new Error("ParentId is required")
    }

    const ispage = await this.model("Page").exists({_id:parentId})
    if(ispage){
        return "Page"
    }
    const isBlock= await this.exists({_id:parentId})
    if(isBlock){
        return "Block"
    }
}

module.exports = mongoose.model('Block', blockSchema);