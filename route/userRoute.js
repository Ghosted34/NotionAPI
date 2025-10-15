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
router.get("/auth/google/callback",
    (req,res,next) => {
        console.log("Inside /auth/google/callback");
       console.log("=== Google callback route hit ===");
       console.log("req.query:", req.query);
       console.log("req.user before authenticate:", req.user);
    
    },
     passport.authenticate("google",{ failureRedirect:"/auth/google/failure" }),
     (req, res) => {
    // Successful authentication
    res.redirect('/profile');
  }
)
router.get("/auth/google/failure", googleFailure)



module.exports = router
