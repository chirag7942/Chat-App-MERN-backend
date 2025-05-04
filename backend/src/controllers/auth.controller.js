const { generateToken } = require("../lib/utils.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary.js");


async function signup(req,res){

    const { fullName, email, password } = req.body;

    try {
        
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

     //checking if any user is present or not with the email or not.
    const user = await User.findOne({ email });


     //if present
      if (user) return res.status(400).json({ message: "Email already exists" });

      //if not present , we'll first hash its password and then create a new user in our database.
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });

  //if user is successfully created in our database, we'll send him jwt
      if (newUser) {
        // generate jwt token here
        generateToken(newUser._id, res);//mongodb automatically gnerates id of the user by itself and it is given as _id.

          //saving the user with   token in db.
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });

      } 
      
      //if user is not created successfully in our database due to some client's error:-
      else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

async function login(req,res){

  const { email, password } = req.body;

  try {


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } 
  
  catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }





}


async function logout(req,res){

  try {

    //for logout, we'll clear cookie's value and make it empty and also maken this token age 0.
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } 
  
  catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

async function updateProfile(req,res){

  try {

    //first, we are extracting profle pic send by the user.
    const { profilePic } = req.body;

    const userId = req.user._id;//get this user id when we call next function from protectroute middleware.

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    //uploading this proflepic to cloudinary to use it in future and when we do this, clouding gives us a response.
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    //updating profle pic of that user in our database.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {

    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });

  }


}

function checkAuth(req,res){

  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
}