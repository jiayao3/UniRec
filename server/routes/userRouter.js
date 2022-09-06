var express = require("express");
var userRouter = express.Router();
const userController = require("../controllers/userControllers");

// hardcode user (testing)
const User = require("../models/user");

userRouter.post("/new", userController.createUser);
userRouter.get("/getUser", userController.getUser);

module.exports = userRouter;