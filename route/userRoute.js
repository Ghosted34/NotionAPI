const express =require("express")
const router = express.Router()
const {createUser, userLogin, getAllUsers, googleSuccess, googleFailure}=require("../controller/userController")
const passport = require("passport")


router.route("/register").post(createUser)
router.route("/login").post(userLogin)
router.route("/").get(getAllUsers)
router.get("/auth/google", 
    passport.authenticate("google", {scope:["profile", "email"]})
)
router.get("/auth/google/success",
     passport.authenticate("google",{ failureRedirect:"/auth/google/failure" }),
     googleSuccess
)
router.get("/auth/google/failure", googleFailure)



module.exports = router