const Task = require("../Models/taskModel")
const CustomAPIError = require("../errors/customErrors")
const { StatusCodes } = require("http-status-codes");

const createTask = async(req,res)=>{
    const{name, completed}=req.body
    const task =  await Task.create({name, completed})
    if (!task){
       throw new CustomAPIError("Task cannot be created", StatusCodes.BAD_REQUEST)
    }
    res.status(StatusCodes.CREATED).json(task)

}


const getTask= async(req,res)=>{
    const{id:taskID}=req.params
    const task = await Task.findOne({_id:taskID})
    if(!task){
        throw new CustomAPIError("Task does not exist", StatusCodes.BAD_REQUEST)
    }
    res.status(StatusCodes.OK).json(task)
    
}

const getAllTask = async(req,res)=>{
    const task = await Task.find({})
    if(task.length===0){
        throw new CustomAPIError("There are no tasks yet", StatusCodes.BAD_REQUEST)
    }
    res.status(StatusCodes.OK).json(task)

}

const updateTask = async(req,res)=>{
    const {name, completed} =req.body
    const{id:taskID}=req.params
    const task = await Task.findOneAndUpdate({_id:taskID},{name,completed}, {
        new:true,
        runValidators:true,
    } )
    if(!task){
        throw new CustomAPIError("Could not update Task", StatusCodes.FORBIDDEN)
    }
    res.status(StatusCodes.OK).json(task)
}

const deleteTask = async(req, res)=>{
    const{id:taskID}=req.params
    const task = await Task.findOne({_id:taskID})
    if(!task){
        throw new CustomAPIError("Task does not exist", StatusCodes.BAD_REQUEST)
    }
    task.deleteOne()
    //console.log("error",err.message)
    
    res.status(StatusCodes.OK).json({"msg": "This task has been deleted"})
}


const TaskController= {
    createTask,
    getTask,
    getAllTask,
    updateTask,
    deleteTask
}

module.exports= TaskController