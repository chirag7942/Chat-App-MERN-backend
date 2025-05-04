const express = require("express");

const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const path = require("path");

const { connectDB } = require("./lib/db");

const authRoutes = require("./routes/auth.route");

const {app,server} = require("./lib/socket");

const messageRoutes = require("./routes/message.route");

//const app = express();  here we commented this app because we've already created server in socket.js and now we'll use that in our index.js

dotenv.config();//to access environment variables of .env file

const PORT = process.env.PORT;//importing PORT environment variable from .env file.



//const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); // this middleware limit is increasing backend image size limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//app.use(express.json());//this middlewares helps us to extract json data from user's body.

app.use(cookieParser());

//CORS allows or restricts requests made from one domain (origin) to another. like here we are gving port no. of frontend in cors so that frontend code can make access to backened api server.
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



//below we converted app.listen to server.listen as because we'll use now socket io server coming from socket.js.
server.listen(PORT, () => {
    console.log("server started at port:" + PORT);
    connectDB();
})

//servers send token to clients at the time of both login and signup






