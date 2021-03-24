require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");

const app = express();
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const USER = mongoose.model("user", userSchema);
const saltRound = 10;

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

    USER.findOne({ email: email }, (err, foundUser) => {
      if (foundUser) {
        bcrypt.compare(pass, foundUser.password, (err, result) => {
          if (result) {
            res.render("secrets");
          }
        });
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
    let pass = req.body.password;

    bcrypt.hash(pass, saltRound, (err, hash) => {
      if (!err) {
        const user = new USER({
          email: req.body.username,
          password: hash,
        });
        // console.log(req.body);

        user.save((err) => {
          if (!err) {
            res.render("secrets");
          } else {
            console.log(err);
          }
        });
      }
    });
  });
