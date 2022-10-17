//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
    secret: "Thisissecret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/loginDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    img: String,
    cityname: String,
    workdetails: String,
    rating: Number,
    uname: String,
    comment: String,
    universityname: String,
    tenderid: String,
    category1: String,
    abouttender: String,
    file: String,
    cname: String,
    exp: Number,
    emailid: String,
    previouswork: String

});

// const universitySchema = new mongoose.Schema({
//     universityname: String,
//     tenderid:String,
//     category:String,
//     abouttender:String
// })


userSchema.plugin(passportLocalMongoose);
// universitySchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
// const University = mongoose.model("University", universitySchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(University.createStrategy());
// passport.serializeUser(University.serializeUser());
// passport.deserializeUser(University.deserializeUser());


app.get("/", function(req, res) {
    res.render("home");
})
app.get("/product", function(req, res) {
        res.render("product");
    })
    // app.get("/tender", function(req, res) {
    //     res.render("tender");
    // })
app.get("/university", function(req, res) {
    res.render("university");
})

app.get("/login", function(req, res) {
    res.render("login");
})
app.get("/contact", function(req, res) {
    res.render("contact");
})
app.get("/about", function(req, res) {
    res.render("about")
})
app.get("/computer", function(req, res) {
    res.render("computer")
})

app.get("/electrical", function(req, res) {
    res.render("electrical");
})
app.get("/createtender", function(req, res) {
    res.render("createTender")
})
app.get("/tenderdetails", function(req, res) {
    res.render("tenderdetails")
})
app.get("/apply", function(req, res) {
        res.render("apply")
    })
    // app.get("/dashboard", function(req, res) {
    //     res.render("dashboard")
    // })
app.get("/dashboard", function(req, res) {
    User.find({ "exp": { $ne: null } }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // console.log(foundUser);
                res.render("dashboard", { usersApplied: foundUser })
            }
        }
    });
})

app.get("/review", function(req, res) {

    User.find({ "comment": { $ne: null } }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // console.log(foundUser);
                res.render("review", { usersWithRating: foundUser })
            }
        }
    });
});
// app.get("/createtender", function(req, res) {

// })
app.get("/tender", function(req, res) {
    User.find({ "abouttender": { $ne: null } }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // console.log(foundUser);
                res.render("tender", { usersWithTender: foundUser })
            }
        }
    });
})

app.get("/media", function(req, res) {

    User.find({ "workdetails": { $ne: null } }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // console.log(foundUser);
                res.render("media", { usersWithPost: foundUser })
            }
        }
    });
});



app.get("/compose", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("compose")
    } else {
        res.redirect("/login")
    }
})


app.post("/compose", function(req, res) {
    const submittedDescription = req.body.subject;
    const submittedCity = req.body.city;
    const submittedImage = req.body.file;

    User.findById(req.user.id, function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("/login")
            } else {
                foundUser.workdetails = submittedDescription;
                foundUser.cityname = submittedCity;
                foundUser.img = submittedImage;
                foundUser.save(function() {
                    res.redirect("/media");
                })

            }
        })
        // console.log(req.user.id);
})
app.post("/review", function(req, res) {
    const submittedName = req.body.userName;
    const submittedComment = req.body.userMessage;
    const submittedRating = req.body.rating;
    // const submittedImage = req.body.file;

    User.findById(req.user.id, function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("/login")
            } else {
                foundUser.uname = submittedName;
                foundUser.comment = submittedComment;
                foundUser.rating = submittedRating;
                // foundUser.img = submittedImage;
                foundUser.save(function() {
                    res.redirect("/review");
                })

            }
        })
        // console.log(req.user.id);
})
app.post("/createtender", function(req, res) {
    const submittedUniversity = req.body.universityName;
    const submittedCategory1 = req.body.tenderCategory;
    const submittedId = req.body.tenderid;
    const submittedTender = req.body.tender;

    User.findById(req.user.id, function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("/login")
            } else {
                foundUser.universityname = submittedUniversity;
                foundUser.category1 = submittedCategory1;
                foundUser.tenderid = submittedId;
                foundUser.abouttender = submittedTender;
                foundUser.save(function() {
                    res.redirect("/tender");
                })

            }
        })
        // console.log(req.user.id);
})
app.post("/apply", function(req, res) {
    const submittedDescription = req.body.subject;
    const submittedCname = req.body.cname;
    const submittedFile = req.body.file;
    const submittedExperience = req.body.exp;
    const submittedMail = req.body.emailid;

    User.findById(req.user.id, function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("/login")
            } else {
                foundUser.previouswork = submittedDescription;
                foundUser.cname = submittedCname;
                foundUser.file = submittedFile;
                foundUser.exp = submittedExperience;
                foundUser.emailid = submittedMail;
                foundUser.save(function() {
                    res.redirect("/dashboard");
                })

            }
        })
        // console.log(req.user.id);
})


app.post("/register", function(req, res) {

    User.register({ username: req.body.username, email: req.body.mail }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/compose");
            })
        }
    })
});

app.post("/userin", function(req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/compose");
            })
        }
    })
})



app.listen(3000, function() {
    console.log("server started on port 3000");
});