const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("./../middlewares/protectAdminRoute")
const bcrypt = require("bcrypt"); // lib to encrypt data
const uploader = require("./../config/cloudinary");


const UserModel =require("../model/User")

router.get("/signin", (req, res, next)=>res.render("auth/signin"))

router.post("/signin", async(req, res, next)=>{
    const {email, password}=req.body
    const foundUser = await UserModel.findOne({ email: email });

  if (!foundUser) {
    //   Display an error message telling the user that either the password
    // or the email is wrong
    req.flash("error", "Invalid credentials");
    res.redirect("/auth/signin");
    // res.render("auth/signin.hbs", { error: "Invalid credentials" });
  } else {
    // https://www.youtube.com/watch?v=O6cmuiTBZVs
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      // Display an error message telling the user that either the password
      // or the email is wrong
      req.flash("error", "Invalid credentials");
      res.redirect("/auth/signin");
      // res.render("auth/signin.hbs", { error: "Invalid credentials" });
    } else {
      // everything is fine so :
      // Authenticate the user...
      const userObject = foundUser.toObject();
      delete userObject.password; // remove password before saving user in session
      // console.log(req.session, "before defining current user");
      req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)

      // https://www.youtube.com/watch?v=nvaE_HCMimQ
      // https://www.youtube.com/watch?v=OFRjZtYs3wY

      req.flash("success", "Successfully logged in...");
      res.redirect("/profile");
    }
  }
})

router.get("/signup", (req, res, next)=>{
  res.render('auth/signup')
})

router.post("/signup", uploader.single("avatar"), async (req, res, next)=>{
     try {
    const newUser = { ...req.body };
    const foundUser = await UserModel.findOne({ email: newUser.email });
    console.log("-----ETAPE 1---------");
    if (foundUser) {
      console.log("-----ETAPE 2---------");
      req.flash("warning", "Email already registered");
      res.redirect("/auth/signup");
    } else {
      console.log("-----ETAPE 3---------");
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await UserModel.create(newUser);
      req.flash("success", "Congrats ! You are now registered !");
      res.redirect("/auth/signin");
    }
  } catch (err) {
    let errorMessage = "";
    for (field in err.errors) {
      errorMessage += err.errors[field].message + "\n";
    }
    console.log("-------ETAPE 4-------");
    req.flash("error", errorMessage);
    res.redirect("/auth/signup");
  }
})

router.get("/signout", (req, res, next)=>{
  console.log(req.session);
  req.session.destroy(function (err) {
    
    // cannot access session here anymore
    res.redirect("/auth/signin");
  });
})







module.exports= router 

