//here we gave filename as auth.route to just signify that this file belongs to route folder.

const express = require("express");


const { signup, login, logout, updateProfile, checkAuth} = require("../controllers/auth.controller.js");

const { protectRoute } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.post("/logout", logout);

//here, we have used put method because we will be upadting/editing something on webpage.
router.put("/update-profile", protectRoute, updateProfile);

//this protectRoute middleware will check whether the user is logged in or not, if it is logged in then only user will be able to update its profile.


router.get("/check", protectRoute, checkAuth);//this route will chcek whether the user is authenticated or not everytime when user refershes or do some action.



module.exports = router;