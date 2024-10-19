const express = require("express");
const router = express.Router();
const session = require("express-session");
const nocache = require("nocache");

router.use(nocache());

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);


const isAuthenticated = (req, res, next) => {
  if (req.session.isAuth) {
    return next(); 
  } else {
    return res.redirect("/"); 
  }
};


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const credential = [
  { email: "admin@gmail.com", password: "Admin@123" },
  { email: "ajmal@gmail.com", password: "Ajmal@123" },
];

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.render("base", {
      title: "Express",
      logout_err: "Invalid email format",
    });
  }

  // if (!passwordRegex.test(password)) {
  //   return res.render("base", {
  //     title: "Express",
  //     logout_err:
  //       "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit",
  //   });
  // }

  const user = credential.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    req.session.user = user.email;
    req.session.isAuth = true;
    return res.redirect("/dashboard");
  } else {
    return res.render("base", {
      title: "Express",
      logout_err: "Invalid username or password",
    });
  }
});

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user, logout: "" });
});

router.get("/", (req, res) => {
  if (req.session.isAuth) {
    return res.render("dashboard", { user: req.session.user, logout: "" });
  } else {
    return res.render("base", { title: "Express", logout: "" });
  }
});
router.get("/login", (req, res) => {
  if (req.session.isAuth) {
    return res.render("dashboard", { user: req.session.user, logout: "" });
  } else {
    return res.render("base", { title: "Express", logout: "" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    return res.render("base", { title: "Express", logout: "logout successfully" });
  });
});

module.exports = router;
