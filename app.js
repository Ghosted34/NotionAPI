
//require("express-async-errors")
require("./config/passport")
const express = require ("express")
const connectdb = require("./db")
const passport= require("passport")
const session = require("express-session")
const crypto= require("crypto")
const config = require("./config/index")
const TaskRoutes= require("./route/taskRoute")
const userRoutes= require("./route/userRoute")
const workspaceRoutes = require("./route/workspaceRoute")
const pageRoutes = require("./route/pageRoute")
const app = express()
const PORT = process.env.PORT||3000
const notFound= require("./middleware/notFound")
const errorHandler =require("./middleware/errorHandler")





//Health Check Endpoint

app.use(session({
secret: config.session.secret,
resave: false,
saveUninitialized: true,
cookie: { 
   secure: false,
   httpOnly: true,
   maxAge: 1000 * 60 * 60 * 24 
}
}))

app.use("/health", (req,res)=>{
   res.json({
      status:"ok",
      environment:config.env,
      timestamp: new Date().toISOString()
   })
})
app.use(passport.initialize())
app.use(passport.session())


app.use(express.json())

app.use("/api/v1/task", TaskRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/workspace", workspaceRoutes)
app.use("/api/v1/", pageRoutes)

app.use(errorHandler)
app.use(notFound)


const state= crypto.randomBytes(32).toString("hex")


const start = async()=>{
 try{
    await connectdb(config.db.uri)
    app.listen(PORT, ()=>console.log(`server is listening on ${PORT}`))
 }
 catch(error){
    console.log(error.message)
 }
}
start()