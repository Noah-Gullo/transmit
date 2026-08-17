const { Router } = require("express");
const passport = require("passport");

const { signup, login, logout} = require("../controllers/authController");

const { getMessages, sendMessage } = require("../controllers/messagesController");

const { getUsers } = require("../controllers/usersController");

const indexRouter = Router();

indexRouter.post("/signup", signup);
indexRouter.post( "/login", passport.authenticate("local"), login );
indexRouter.post("/logout", logout);

indexRouter.get("/users", getUsers);

indexRouter.get("/messages", getMessages);
indexRouter.post("/messages", sendMessage);

module.exports = indexRouter;