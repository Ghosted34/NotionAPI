const dotenv = require("dotenv");
const path = require("path")

const env = process.env.NODE_ENV 
           ?`.env.${process.env.NODE_ENV}`
           :'.env.development'

dotenv.config({
    path: path.resolve(__dirname, '..', env)
})



const config= {
    env:process.env.NODE_ENV || "development",
    isDevelopment:process.env.NODE_ENV==="development",
    isProduction:process.env.NODE_ENV==="production",
    
    server:{
        port: process.env.PORT || 3000
    },

    db:{
        uri: process.env.MONGO_URI
    },
    session:{
        secret:process.env.SESSION_SECRET,
    },
    jwt:{
        secret:process.env.JWT_SECRET
    }, 
    google:{
        clientId:process.env.OAUTH_CLIENT_ID,
        clientSecret:process.env.OAUTH_CLIENT_SECRET,
        redirectUri: process.env.OAUTH_REDIRECT_URL
    },
    session:{
        secret:process.env.SESSION_SECRET
    }
}

module.exports= config