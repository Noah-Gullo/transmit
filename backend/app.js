#! .env
const express = require('express');
const app = express();
const PORT = 3000;
const path = require("node:path");
const session = require('express-session');
const pgSession = require("connect-pg-simple")(session);
const passport = require('passport'); 
const indexRouter = require('./routes/indexRouter');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(
  session({
    store: new pgSession({
      conString: process.env.DB_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
require("./passport"); 

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexRouter);

app.listen(PORT, (error) => {
    if(error){
        throw error;
    }
    
    console.log(`Listening on ${PORT}`);
})