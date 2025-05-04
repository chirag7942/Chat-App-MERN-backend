const express = require("express");

const { protectRoute } = require("../middleware/auth.middleware.js");
const { getUsersForSidebar, getMessages, sendMessage} = require("../controllers/message.controller.js");

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
//from this route, we'll show authenticated user all the users with their online status.


router.get("/:id", protectRoute, getMessages); //this route will give the current logged in user all trhe messages with the user whose id we're giving in the route.

router.post("/send/:id", protectRoute, sendMessage);//this route will enable the current user to send message to any particular user.

module.exports = router;