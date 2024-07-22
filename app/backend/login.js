require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const { redirect } = require('next/dist/server/api-utils');

const mongokey = 'maximegarnier@g96wrFlhkDFH4nH0';

const app = express();

// Replace these values with your client ID and secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const SERVER_PORT = process.env.AUTH_PORT;
const JWT_SECRET = process.env.JWT_SECRET_KEY;

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

/*
// Function to set a JWT into a cookie
function setCookie(name, jwt, hours) {
  let expires = "";
  if (hours) {
      const date = new Date();
      date.setTime(date.getTime() + (hours*3600*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (jwt || "")  + expires + "; path=/";
}

// Function to get the JWT in a cookie value
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
*/

const MONGO_DB = MONGO_CLIENT.db("apiproject");
const MONGO_USERS = MONGO_DB.collection("users");

// Configure the Google strategy for Passport
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/callback"
  },
  async function(accessToken, refreshToken, profile, done) {

    const token = jwt.sign({
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value
    }, JWT_SECRET, { expiresIn: '1h' });

    if (await MONGO_USERS.findOne({'id': profile.id}) === null){
      MONGO_USERS.insertOne({
                                  id: profile.id, 
                                  displayName: profile.displayName,
                                  email: profile.emails[0].value,
                                  accessToken: accessToken,
                                  jwt_token: token
                                });
    } else {
      MONGO_USERS.updateOne({'id': profile.id}, {$set: {'jwt_token': token, 'accessToken': accessToken}});
    }
    return done(null, profile, {token});
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
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback route
app.get('/auth/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Retrieve the JWT token from req.authInfo
  const token = req.authInfo.token;
  console.log("token : " + token);
  // Send the token to the client (e.g., in a query parameter, header, or cookie)
  res.cookie('token', token, { httpOnly: true });
  res.redirect(`http://localhost:3000`);
});

// Route to display the user's profile after authentication
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Invalid token');
        res.redirect('/auth/google'); 
      }
      res.json({ message: 'Profile data', user: decoded });
    });
  } else {
    res.status(401).json({ message: 'Token required' });
    res.redirect('/auth/google');
  }
});


app.listen(SERVER_PORT, () => {
  console.log(`Login is running on http://localhost:${SERVER_PORT}`);
});
