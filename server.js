const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const User = require("./User.js");
const uri = process.env.URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const data = await User.findOne({ email: email });
  if (data) {
    res.send({ status: 3 });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const temp = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      const data = await temp.save();
    } catch (error) {
      console.log(error);
    }
    res.send({ status: 1 });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const data = await User.findOne({ email: email });
  if (data) {
    const temp = bcrypt.compareSync(password, data.password);
    if (temp) {
      console.log(temp);
      res.send({ status: 2 });
    } else {
      res.send({ status: -1 });
    }
  } else {
    res.send({ status: 0 });
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));

/*
status:
0-User not Found
1-Sign Up Successful
2-User Logging in Sucessful
3-User Already Exist
-1-Wrong Password

*/
