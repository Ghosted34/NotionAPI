const express = require("express")
const router = express.Router()
const  TaskController= require("../controller/taskController")

router.route("/").get(TaskController.getAllTask).post(TaskController.createTask)
router.route("/:id").get(TaskController.getTask).patch(TaskController.updateTask).delete(TaskController.deleteTask)



module.exports = router