require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongokey = 'maximegarnier@g96wrFlhkDFH4nH0';

const app = express();

// Replace these values with your client ID and secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}`;

console.log(MONGO_URI);

// Create a new MongoClient

const MONGO_CLIENT = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const MONGO_DB = MONGO_CLIENT.db("apiproject");
const MONGO_USERS = MONGO_DB.collection("users");

console.log(MONGO_USERS);

// Configure the Google strategy for Passport
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    MONGO_USERS.insertOne({
                                id: profile.id, 
                                displayName: profile.displayName, 
                                token: accessToken,
                                refresh: refreshToken
                              });
    return done(null, profile);
  }
));

// Serialize user information into the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Route to start the OAuth flow
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// OAuth callback route
app.get('/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  });

// Route to display the user's profile after authentication
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/google');
  }
  res.send(`Hello ${req.user.displayName}`);
});

app.listen(3005, () => {
  console.log('Server is running on http://localhost:3005');
});
