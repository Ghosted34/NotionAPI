const passport= require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const config= require('./index');
const User= require("../Models/userModels");

passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.redirectUri
},
 async (accessToken, refreshToken, profile, done) => {
    try{
        let user= await User.findOne({googleId: profile.id})
        if(!user){
            user=  await User.create({
           googleId: profile.id,
           email: profile.emails[0].value,
           name: profile.displayName,
           authProvider: 'google'

            })
        }
         return done(null, user);
    }
    catch(err){
        return done(err)
    }
 }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try{
        const user= await User.findById(id)
        done(null, user);
    }
    catch(err){
        done(err)
    }
})


module.exports= passport;