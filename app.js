require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedField: "password",
});

const USER = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen("3000", () => {
  console.log("Server started at 3000");
});

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.username;
    const pass = req.body.password;

    USER.findOne({ email: email, password: pass }, (err, foundUser) => {
      if (!err && foundUser != null) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const user = new USER({
      email: req.body.username,
      password: req.body.password,
    });
    // console.log(req.body);

    user.save((err) => {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
