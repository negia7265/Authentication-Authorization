const express = require("express");
require("dotenv").config();
const app = express();
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
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = await User.findOne({ email: email });
  if (data) {
    const temp = bcrypt.compareSync(password, data.password);
    if (temp) {
      console.log(temp);
    } else {
      res.send({ status: -1 });
    }
    res.send({ status: 2 });
  } else {
    res.send({ status: 0 });
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));
