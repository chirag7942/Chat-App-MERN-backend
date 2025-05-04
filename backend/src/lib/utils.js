const jwt = require("jsonwebtoken");

async function generateToken(userId, res) { //userId is paylaod here

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",//it means this token will valid only for 7days after which user needs to be login again.
  });

 //sending token to user in cookies.
  res.cookie("jwt", token, {//jwt is name of cookie

    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MilliSeconds

    httpOnly: true, // prevent XSS attacks cross-site scripting attacks

    // If a malicious script somehow gets injected into our site (e.g., through an XSS vulnerability), it won't be able to read or steal the token from cookies if it's HttpOnly, it means we can access site with http only not with js.

    sameSite: "strict", // CSRF attacks cross-site request forgery attacks

 // This samesite strict only allows the cookie to be sent in requests that originate from the same site this means other site requests will NOT include the cookie.

    secure: process.env.NODE_ENV !== "development",//it is signifying whether the website will be https of http and in developemnt will use secure(https). 
  });

  return token;
};

module.exports = {
    generateToken
}