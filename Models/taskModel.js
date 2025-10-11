const mongoose = require("mongoose")
const {Schema} =mongoose

const taskSchema = new Schema ({
    name:{
        type:String,
        trim:true,
        required:[true, "name is required"],
        maxLength:[20, "name must not exceed 20 characters"]
        
    },
    completed:{
        type:Boolean,
        required:true
        
    }
})

module.exports = mongoose.model("Task", taskSchema)