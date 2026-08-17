const { Router } = require("express");
const passport = require("passport");

const { signup, login, logout} = require("../controllers/authController");
const { getMessages, sendMessage } = require("../controllers/messagesController");
const { getUsers } = require("../controllers/usersController");

const { getOwnProfile, getUserProfile,updateProfile } = require("../controllers/profileController");

const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);

indexRouter.get("/users", getUsers);


indexRouter.get("/profile", getOwnProfile);
indexRouter.put("/profile", updateProfile);
indexRouter.get("/users/:userId/profile", getUserProfile);

indexRouter.get("/messages/:userId", getMessages);
indexRouter.post("/messages/:userId", sendMessage);

module.exports = indexRouter;