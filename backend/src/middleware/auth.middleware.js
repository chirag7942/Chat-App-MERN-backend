const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function protectRoute(req, res, next){
  try {

    //first, we're extracting token's value
    const token = req.cookies.jwt;

    //if token is not present in cookies,
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    //if token is find with its value, we'll check whether this token is correct or not.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//this will return true or false;

    //if token is invalid:-
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    //if token is valid, we'll return user itself by finding it by its id in return by deselcting password.
    const user = await User.findById(decoded.userId).select("-password");

    //if no such user is found.
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    //calling next function , as because user is authenticated.
    next();
  } 
  
  catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    protectRoute
}