require('dotenv').config();
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const fs = require('fs');
const multer = require('multer');
const flash = require('express-flash');
const nodemailer = require("nodemailer")
const { Email_id, Email_password } = process.env;


const app = express();

// var http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');
// const { isatty } = require('tty');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', paymentRoute);

app.use(session({
    secret: "Our littlr secret.",
    resave: false,
    saveUninitialized: false
}));

// Flash message  
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: Email_id,
        pass: Email_password
    }
});


mongoose.connect("mongodb://127.0.0.1:27017/travelDB", { useNewUrlParser: true })
    .then(() => console.log('Connected to database1....'))
    .catch(err => console.log('Refuse to connect1...'));



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String
});


const placeSchema = new mongoose.Schema({
    placeName: String,
    placeContent: String,
    duration: String,
    price: String,
    greeting: String,
    age: String,
    hotelName: String,
    hotelRating: String,
    area: String,
    placesName: String,
    img2:
    {
        data: Buffer,
        contentType: String
    },
    img3:
    {
        data: Buffer,
        contentType: String
    },
    img4:
    {
        data: Buffer,
        contentType: String
    },
    img5:
    {
        data: Buffer,
        contentType: String
    },
})

const userSchema1 = new mongoose.Schema({
    pName: String,
    city: String,
    roomType: String,
    date: String,
    firstName: String,
    lastName: String,
    phone: Number,
    email: String,
    adharNumber: Number,
    price: String,
    hotelName: String
});

const eventSchema = new mongoose.Schema({
    placeName: String,
    placeContent: String,
    duration: String,
    price: String,
    greeting: String,
    age: String,
    hotelName: String,
    hotelRating: String,
    area: String,
    placesName: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
})

const frontEventSchema = new mongoose.Schema({
    placeName: String,
    frontEvent: String,
    imgFrontEvent:
    {
        data: Buffer,
        contentType: String
    }
})

const commentSchema = new mongoose.Schema({
    title: String,
    rating: String,
    comment: String,
    profileimg:
    {
        data: Buffer,
        contentType: String
    }
})




userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Place = new mongoose.model("Place", placeSchema);
const User1 = new mongoose.model("User1", userSchema1);
const Event = new mongoose.model("Event", eventSchema);
const FrontEvent = new mongoose.model("FrontEvent", frontEventSchema);
const Comment = new mongoose.model("Comment", commentSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, isAdmin: user.isAdmin })
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/event",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessTocken, refeshTocken, profile, done) {
        User.findOne({ 'googleId': profile.id })
            .then(user => {
                if (!user) {
                    user = new User({
                        googleId: profile.id
                    });
                    user.save()
                        .then(() => done(null, user))
                        .catch(err => done(err));

                    //found user
                } else {
                    done(null, user);
                }
            })
            .catch(err => done(err));
    }
));



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, files, cb) => {
        cb(null, files.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get("/", async function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        var username = req.user.username;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            console.log("else");
            isAdmin = false;
        }
    }
    else {
        isAuthenticated = false;
        isAdmin = false;
    }

    const popular = await FrontEvent.find({ frontEvent: "Popular" });
    const winter = await FrontEvent.find({ frontEvent: "Winter" });
    const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
    const summer = await FrontEvent.find({ frontEvent: "Summer" });
    const states = await FrontEvent.find({ frontEvent: "States" });
    const isuser = await User.findOne({ username: username })
    const comment = await Comment.find({});

    if (popular || winter || monsoon || summer || states) {
        res.render("index", { data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, commentData: comment, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser, messagesSuccessComment: req.flash('successComment'),  messagesErrorComment: req.flash('errorComment')  })
    } else {
        console.log('Failed to retrieve the Course List: ' + err);
    }
});




app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get('/auth/google/event',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/event");
    });



app.get("/index", async function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        var username = req.user.username;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            console.log("else");
            isAdmin = false;
        }
    }
    else {
        isAuthenticated = false;
        isAdmin = false;
    }

    const popular = await FrontEvent.find({ frontEvent: "Popular" });
    const winter = await FrontEvent.find({ frontEvent: "Winter" });
    const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
    const summer = await FrontEvent.find({ frontEvent: "Summer" });
    const states = await FrontEvent.find({ frontEvent: "States" });
    const isuser = await User.findOne({ username: username })
    const comment = await Comment.find({});

    if (popular || winter || monsoon || summer || states) {
        res.render("index", { data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, commentData: comment, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser, messagesSuccessComment: req.flash('successComment'), messagesErrorComment: req.flash('errorComment') })

    } else {
        console.log('Failed to retrieve the Course List: ' + err);
    }
});

app.get("/login", function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        var username = req.user.username;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            console.log("else");
            isAdmin = false;
        }
    }
    else {
        isAuthenticated = false;
        isAdmin = false;
    }
    res.render("login", { messages: req.flash('success'), messages2: req.flash('success2') });
});

app.get("/register", function (req, res) {
    res.render("register", { messages: req.flash('error') });
});


app.post("/register", function (req, res) {

    User.register({ username: req.body.username, name: req.body.name }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', 'Email Address Already logged in...');
            res.redirect("/register");
            return;
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash('success', 'Your Registration Successfully Done.');
                res.redirect("/login");
                return;
            });

            var mailOptions = {
                from: "ruchirgparmar@gmail.com",
                to: req.body.username,
                subject: "Joureneyr Account Register",
                text: `Thank you ${req.body.username} for registering with us`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Email Sent Succesfully")
                }
            })
        }
    });
});


app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    let username = user.username;
    console.log(username)

    console.log(user._id)

    if (user.username === "abcd@gmail.com" && user.password === "Abcd@123") {
    // if (user.id === "64eadac299b6204c49ed520e") {
        console.log(user.id)
        req.login(user, async function (err) {
            let isAdmin = true;
            let isAuthenticated = true;
            const popular = await FrontEvent.find({ frontEvent: "Popular" });
            const winter = await FrontEvent.find({ frontEvent: "Winter" });
            const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
            const summer = await FrontEvent.find({ frontEvent: "Summer" });
            const states = await FrontEvent.find({ frontEvent: "States" });
            const eventInfo = await Event.find({})
            const isuser = await User.findOne({ username: username })
            const comment = await Comment.find({});
            if (err) {
                console.log(err);
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    res.render("index", {eventData: eventInfo, data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, commentData: comment, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser, messagesSuccessComment: req.flash('successComment'), messagesErrorComment: req.flash('errorComment')  });
                    // isAuthenticated = false;
                });
            }
        });
    }
    else {
        req.login(user, async function (err) {
            let isAdmin = false;
            let isAuthenticated = true;

            const popular = await FrontEvent.find({ frontEvent: "Popular" });
            const winter = await FrontEvent.find({ frontEvent: "Winter" });
            const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
            const summer = await FrontEvent.find({ frontEvent: "Summer" });
            const states = await FrontEvent.find({ frontEvent: "States" });
            const eventInfo = await Event.find({})
            const isuser = await User.findOne({ username: username })
            const comment = await Comment.find({});

            console.log(isuser)
            if (err) {
                console.log(err);
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    console.log(isAuthenticated)
                    res.render("event", {eventData: eventInfo, data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, commentData: comment, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser });
                    // isAuthenticated = false;
                });
            }
        });
    }
});

app.get('/logout', async function (req, res, next) {
    let isAuthenticated = false;
    let isAdmin = false;
    const popular = await FrontEvent.find({ frontEvent: "Popular" });
    const winter = await FrontEvent.find({ frontEvent: "Winter" });
    const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
    const summer = await FrontEvent.find({ frontEvent: "Summer" });
    const states = await FrontEvent.find({ frontEvent: "States" });
    const comment = await Comment.find({});
    req.logout(function (err) {
        // if (err) { return next(err); }
        // res.redirect('/');
        if (err) {
            console.log(err);
        }
        else {
            console.log(isAuthenticated)
            res.render("index", { data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, commentData: comment, isAuthenticated: isAuthenticated, isAdmin: isAdmin, messagesSuccessComment: req.flash('successComment'),messagesErrorComment: req.flash('errorComment')  });
        }
    });
});

app.get("/forgatePassword", function (req, res) {
    res.render("forgatePassword", { messagesForget: req.flash('errorForget'), messagesOtp: req.flash('errorOTP') });
})

app.post("/forgatPassword", async function (req, res) {
    let username = req.body.username;
    let username2 = username;
    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    let user = await User.findOne({ username: username2 })
    if (user) {
        var mailOptions = {
            from: process.env.Email_id,
            to: req.body.username,
            subject: "Reset Password OTP",
            text: `One time OTP: ${otp}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Email Sent Succesfully")
            }
        })
        let name = user.name
        res.render("otpChecking", { username: username, username2: username2, otp: otp, name: name })
    }
    else {
        req.flash('errorForget', 'Your Account is not Registered...');
        res.redirect("/forgatePassword");
        return;

    }
})


app.post("/otpChecking", async function (req, res) {
    let username = req.body.username;
    let username2 = req.body.username2;
    let name = req.body.name;
    let otp = req.body.otp;
    let otpCheck = req.body.otpCheck;

    if (otp === otpCheck) {
        let deleteUser = await User.deleteOne({ username: username2 });
        if (deleteUser) {
            res.render("confirmPassword", { username: username, username2: username2, name: name, messagesPasswordError: req.flash('errorPassword') });
        }
    } else {
        req.flash('errorOTP', 'Invalid OTP');
        res.redirect("/forgatePassword");
        return;
    }
})

app.get("/confirmPassword", function (req, res) {
    console.log("Ruchir")
    let username = req.body.username;
    let username2 = req.body.username2;
    let name = req.body.name;
    res.render("confirmPassword", { username: username, username2: username2, name: name, messagesPasswordError: req.flash('errorPassword') })
})


app.post("/confirmPassword", async function (req, res) {
    let username = req.body.username;
    let name = req.body.name;
    let password1 = req.body.password1;
    let password2 = req.body.password2;

    if (password1 === password2) {
        User.register({ username: username, name }, req.body.password2, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");

            } else {
                var mailOptions = {
                    from: process.env.Email_id,
                    to: req.body.username,
                    subject: "Joureneyr Account Reset Password",
                    text: `Your Password reset successfully Done.. 
                    Username: ${req.body.username}
                    password: ${req.body.password2}`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {

                        console.log(error)
                    }
                    else {
                        console.log("Email Sent Succesfully")
                    }
                })
                req.flash('success2', 'Your Password Reset Successfully Done.');
                res.redirect("/login");
                return;
            }
        });
    } else {
        console.log("Password not matched....")
        req.flash('errorPassword', 'Password and Confirm Password not matched...');
        res.redirect("/confirmPassword");
        return;
    }
})



app.get("/about", async function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        var username = req.user.username;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            console.log("else");
            isAdmin = false;
        }
    }
    else {
        isAuthenticated = false;
        isAdmin = false;
    }
    const popular = await FrontEvent.find({ frontEvent: "Popular" });
    const winter = await FrontEvent.find({ frontEvent: "Winter" });
    const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
    const summer = await FrontEvent.find({ frontEvent: "Summer" });
    const states = await FrontEvent.find({ frontEvent: "States" });
    const isuser = await User.findOne({ username: username })

    if (popular || winter || monsoon || summer || states) {
        res.render("about", { data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser })
    } else {
        console.log('Failed to retrieve the Course List: ' + err);
    }
});

app.get("/contact", async function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        var username = req.user.username;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            console.log("else");
            isAdmin = false;
        }
    }
    else {
        isAuthenticated = false;
        isAdmin = false;
    }
    const popular = await FrontEvent.find({ frontEvent: "Popular" });
    const winter = await FrontEvent.find({ frontEvent: "Winter" });
    const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
    const summer = await FrontEvent.find({ frontEvent: "Summer" });
    const states = await FrontEvent.find({ frontEvent: "States" });
    const isuser = await User.findOne({ username: username })

    if (popular || winter || monsoon || summer || states) {
        res.render("contact", { data: popular, winterData: winter, monsoonData: monsoon, summerData: summer, statesData: states, isAuthenticated: isAuthenticated, isAdmin: isAdmin, isuser: isuser })
    } else {
        console.log('Failed to retrieve the Course List: ' + err);
    }
});





app.post("/comment", upload.single('profileimg'), function (req, res, next) {
    console.log(req.body.title)
    console.log(req.body.rating)
    console.log(req.body.comment);

    const newComment = new Comment({
        title: req.body.title,
        rating: req.body.rating,
        comment: req.body.comment,
        // profileimg: {
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        //     contentType: 'profileimg/png' || 'profileimg/jpeg' || 'profileimg/jpg'
        // },
    });

    if (req.file) {
        newComment.profileimg = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'profileimg/png' || 'profileimg/jpeg' || 'profileimg/jpg'
        };
    }

    newComment.save()
        .then(() => {
            // res.send("Successfully added new place");
            req.flash('successComment', 'Successfully added your Comment');
            res.redirect("/index")
            return;
        })
        .catch((err) => {
            console.log(err)
            req.flash('errorComment', 'Not added your Comment...Please Try Again...');
            res.redirect("/index")
            return;
        })
})


app.post("/deleteComment", async function (req, res) {
    console.log(req.body.title);

    const commentDelete = await Comment.deleteOne({ title: req.body.title });


    if (commentDelete) {
        req.flash('successDeleteComment', 'Successfully Delete Comment');
        res.redirect("/admin")
        return;
    } else {
        console.log('Failed to retrieve the Course List: ' + err);
        req.flash('errorDeleteComment', 'Not Deleted Comment Try Again...');
        res.redirect("/admin")
        return;
    }
})



var uploadMultiple = upload.fields([{ name: 'image2' }, { name: 'image3' }, { name: 'image4' }, { name: 'image5' }])
app.route("/place")
    .post(uploadMultiple, function (req, res, next) {

        console.log(req.files.image2[0].filename)
        console.log(req.files.image3[0].filename)
        console.log(req.files.image4[0].filename)
        console.log(req.files.image5[0].filename)
        console.log(req.body.area);
        console.log(req.body.hotelRating);

        const newPlace = new Place({
            placeName: req.body.placeName,
            placeContent: req.body.placeContent,
            duration: req.body.duration,
            price: req.body.price,
            greeting: req.body.greeting,
            age: req.body.age,
            hotelName: req.body.hotelName,
            hotelRating: req.body.hotelRating,
            area: req.body.area,
            placesName: req.body.placesName,
            img2: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.image2[0].filename)),
                contentType: 'image2/jpg' || 'image2/jpeg' || 'image2/png'
            },
            img3: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.image3[0].filename)),
                contentType: 'image3/jpg' || 'image3/jpeg' || 'image3/png'
            },
            img4: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.image4[0].filename)),
                contentType: 'image4/jpg' || 'image4/jpeg' || 'image4/png'
            },
            img5: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.image5[0].filename)),
                contentType: 'image5/jpg' || 'image5/jpeg' || 'image5/png'
            }
        });

        newPlace.save()
            .then(() => {
                // res.send("Successfully added new place");
                req.flash('successEventpage', 'Successfully Added new Event.');
                res.redirect("/admin");
                return;
            })
            .catch((err) => {
                req.flash('errorEventpage', 'Oops... New Event Not Added...');
                res.redirect("/admin");
                return;
            })
    })





app.route("/place/:placeTitle")
    .get(async function (req, res) {

        let isAuthenticated;
        let isAdmin;
        if (req.isAuthenticated()) {
            var username = req.user.username;
            isAuthenticated = true;
            if (req.user.id === '64eadac299b6204c49ed520e') {
                isAdmin = true;
            }
            else {
                isAdmin = false;
            }
        }
        else {
            isAuthenticated = false;
            isAdmin = false;
        }
        const popular = await FrontEvent.find({ frontEvent: "Popular" });
        const winter = await FrontEvent.find({ frontEvent: "Winter" });
        const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
        const summer = await FrontEvent.find({ frontEvent: "Summer" });
        const states = await FrontEvent.find({ frontEvent: "States" });
        const isuser = await User.findOne({ username: username })


        if (popular || winter || monsoon || summer || states) {
            console.log(req.params.placeTitle);
            Place.findOne({ placeName: req.params.placeTitle })
                .then((foundPlace) => {
                    res.render("place/places", 
                    { 
                        placeDetail: foundPlace, 
                        data: popular, 
                        winterData: winter, 
                        monsoonData: monsoon, 
                        summerData: summer, 
                        statesData: states, 
                        isAuthenticated: isAuthenticated, 
                        isAdmin: isAdmin, 
                        isuser: isuser 
                    });
                })
                .catch((err) => {
                    res.send("NO Place matching that title was found");
                });
        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    })




app.route("/event")
    .get(async function (req, res) {
        let isAuthenticated;
        let isAdmin;
        if (req.isAuthenticated()) {
            var username = req.user.username;
            isAuthenticated = true;
            if (req.user.id === '64eadac299b6204c49ed520e') {
                isAdmin = true;
            }
            else {
                isAdmin = false;
            }

            const popular = await FrontEvent.find({ frontEvent: "Popular" });
            const winter = await FrontEvent.find({ frontEvent: "Winter" });
            const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
            const summer = await FrontEvent.find({ frontEvent: "Summer" });
            const states = await FrontEvent.find({ frontEvent: "States" });
            const isuser = await User.findOne({ username: username })

            Event.find({})
                .then((eventInfo) => {
                    res.render("event", 
                    { 
                        eventData: eventInfo, 
                        data: popular, 
                        winterData: winter, 
                        monsoonData: monsoon, 
                        summerData: summer, 
                        statesData: states, 
                        isAuthenticated: isAuthenticated, 
                        isAdmin: isAdmin, 
                        isuser: isuser 
                    })
                })
                .catch(err => {
                    console.log('Failed to retrieve the Course List: ' + err);
                })
        }
        else {
            isAuthenticated = false;
            isAdmin = false;

            const popular = await FrontEvent.find({ frontEvent: "Popular" });
            const winter = await FrontEvent.find({ frontEvent: "Winter" });
            const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
            const summer = await FrontEvent.find({ frontEvent: "Summer" });
            const states = await FrontEvent.find({ frontEvent: "States" });
            const isuser = await User.findOne({ username: username })

            Event.find({})
                .then((eventInfo) => {
                    res.render("event", 
                    { 
                        eventData: eventInfo, 
                        data: popular, 
                        winterData: winter, 
                        monsoonData: monsoon, 
                        summerData: summer, 
                        statesData: states, 
                        isAuthenticated: isAuthenticated, 
                        isAdmin: isAdmin, 
                        isuser: isuser 
                    })
                })
                .catch(err => {
                    console.log('Failed to retrieve the Course List: ' + err);
                })
        }
    })

app.post("/deleteEvent", async function (req, res) {
    console.log(req.body.placeName);

    const eventDelete = await Event.deleteOne({ placeName: req.body.placeName });
    const placeDelete = await Place.deleteOne({ placeName: req.body.placeName });
    const frontEventDelete = await FrontEvent.deleteOne({ placeName: req.body.placeName });


    if (eventDelete || placeDelete || frontEventDelete) {
        req.flash('successEventDelete', 'Successfully Delete Event.');
        res.redirect("/admin");
        return;
    } else {
        console.log('Failed to retrieve the Course List: ' + err);
    }
})




app.get("/hotel", function (req, res) {
    let isAuthenticated;
    let isAdmin;
    if (req.isAuthenticated()) {
        isAuthenticated = true;
        if (req.user.id === '64eadac299b6204c49ed520e') {
            isAdmin = true;
        }
        else {
            isAdmin = false;
        }
        res.render("hotel");
    }
    else {
        isAuthenticated = false;
        isAdmin = false;

       res.redirect("/login");
    }
})



app.post("/hotel", function (req, res) {
    let price = req.body.price;
    let pName = req.body.pName;
    let hName = req.body.hName;
    if(req.isAuthenticated()){
        res.render("hotel", 
        { 
            priceval: price, 
            packageName: pName, 
            hotelName: hName 
        });
    }else{
        res.redirect("/login")
    }
    
})

app.get("/booking", function (req, res) {
    res.render("booking")
})

app.post("/booking", function (req, res) {
    let pName = req.body.pName;
    let city = req.body.city;
    let roomType = req.body.roomType;
    let date = req.body.date;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let phone = req.body.phone;
    let email = req.body.email;
    let adharNumber = req.body.adharNumber;
    let price = req.body.price;
    let hName = req.body.hName;

    const newUser1 = new User1({
        pName: req.body.pName,
        city: req.body.city,
        roomType: req.body.roomType,
        date: req.body.date,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        adharNumber: req.body.adharNumber,
        price: req.body.price,
        hName: req.body.hName
    });

    for (var i = 0; i < price.length; i++) {
        var amount = price.replace(",", "");
    }
    console.log(amount)


    newUser1.save()
        .then(result => {
            res.render("booking", 
            { 
                packageName: pName,
                 city: city, 
                 roomType: roomType, 
                 date: date, 
                 firstName: firstName, 
                 lastName: lastName, 
                 phone: phone, 
                 email: email, 
                 adharNumber: adharNumber, 
                 priceval: price, 
                 hotelName: hName, 
                 amt: amount 
            });
        })
        .catch(err => {
            console.log(err);
        })

});


app.route("/admin")
    .get(async function (req, res) {
        let isAuthenticated = true;
        let isAdmin = true;
        const eventData = await Event.find({});
        const user1Data = await User1.find({});
        const updateData = await Place.find({});
        const commentData = await Comment.find({});
        const popular = await FrontEvent.find({ frontEvent: "Popular" });
        const winter = await FrontEvent.find({ frontEvent: "Winter" });
        const monsoon = await FrontEvent.find({ frontEvent: "Monsoon" });
        const summer = await FrontEvent.find({ frontEvent: "Summer" });
        const states = await FrontEvent.find({ frontEvent: "States" });

        if (eventData || user1Data || popular || winter || monsoon || summer || states) {
            res.render("admin", 
            { 
                userdata: user1Data,
                placeData: eventData,
                updateData: updateData,
                commentData: commentData, 
                data: popular, 
                winterData: winter, 
                monsoonData: monsoon, 
                summerData: summer, 
                statesData: states, 
                isAuthenticated: isAuthenticated, 
                isAdmin: isAdmin, 
                messagesSuccessFrontPageEvent: req.flash('successFrontPageEvent'),
                messagesErrorFrontPageEvent: req.flash('errorFrontPageEvent'),  
                messagesSuccessDeleteComment: req.flash('successDeleteComment'),
                messagesErrorDeleteComment: req.flash('errorDeleteComment'), 
                messagesSuccessPlaceUpdate: req.flash('successPlaceUpdate'), 
                messagesErrorPlaceUpdate: req.flash('errorPlaceUpdate'),
                messagesSuccessEventpage: req.flash('successEventpage'), 
                messagesErrorEventpage: req.flash('errorEventpage'),
                messagesSuccessDeleteEvent: req.flash('successEventDelete')
            })
                
        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    })

app.get("/adminevent", function (req, res) {
    res.render("adminevent")
})


app.get("/adminplace", function (req, res) {
    res.render("adminplace");
});

app.post("/adminplace", upload.single('image'), function (req, res, next) {
    console.log(req.file.filename)

    let placeName = req.body.placeName;
    let placesName = req.body.placesName;
    let duration = req.body.duration;
    let price = req.body.price;
    let greeting = req.body.greeting;
    let age = req.body.age;
    let hotelName = req.body.hotelName;
    let hotelRating = req.body.hotelRating;
    let area = req.body.area;
    let placeContent = req.body.placeContent;


    const newEvent = new Event({
        placeName: req.body.placeName,
        placesName: req.body.placesName,
        duration: req.body.duration,
        price: req.body.price,
        greeting: req.body.greeting,
        age: req.body.age,
        hotelName: req.body.hotelName,
        hotelRating: req.body.hotelRating,
        area: req.body.area,
        placeContent: req.body.placeContent,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image3/jpg' || 'image3/jpeg' || 'image3/png'
        }
    })

    newEvent.save()
        .then(result => {
            res.render("adminplace", 
            { 
                placeName: placeName, 
                placesName: placesName, 
                duration: duration, 
                price: price, 
                greeting: greeting, 
                age: age, 
                hotelName: hotelName, 
                area: area, 
                hotelRating: hotelRating, 
                placeContent: placeContent 
            });
        })
        .catch(err => {
            console.log(err);
        })
})


app.post("/adminFrontEvent", upload.single('imagefront'), function (req, res, next) {
    console.log(req.file.filename)
    console.log(req.body.frontEvent)
    console.log(req.body.placeName)
    const newFrontEvent = new FrontEvent({
        placeName: req.body.placeName,
        frontEvent: req.body.frontEvent,
        imgFrontEvent: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'imagefont/jpg' || 'imagefront/jpeg' || 'imagefont/png'
        }
    })
    newFrontEvent.save()
        .then(result => {
            req.flash('successFrontPageEvent', 'Event Addend in Front Page Successfully done.');
            res.redirect("/admin");
            return;
        })
        .catch(err => {
            req.flash('errorFrontPageEvent', 'Oops.. Event Not Addend in Front Page.');
            res.redirect("/admin");
            console.log(err);
            return;
        })
})




app.post("/eventUpdate", function (req, res) {
    console.log(req.body.placeName)
    let placeName = req.body.placeName
    // res.render("eventUpdate", {placeName: placeName})
    Place.findOne({ placeName: placeName })
        .then((foundPlace) => {
            res.render("eventUpdate", { placeDetail: foundPlace });
        })
        .catch((err) => {
            res.send("NO Place matching that title was found");
        });
})


app.route("/placeupdate")
    .post(async function (req, res) {
        console.log(req.body.placeName);


        const eventData = await Event.findOneAndUpdate({ placeName: req.body.placeName }, { $set: req.body })
        const placeData = await Place.findOneAndUpdate({ placeName: req.body.placeName }, { $set: req.body })


        if (eventData || placeData) {
            console.log("Successfully updated place Detail.");
            req.flash('successPlaceUpdate', 'Event Detail Updated Successfully....');
            res.redirect("/admin");
            return;
        } else {
            console.log("NO Place matching that title was found");
            req.flash('errorPlaceUpdate', 'Oops!..Event Detail Not Updated.');
            res.redirect("/admin");
            return;
        }
    })


app.get("/eventUpdate", function (req, res) {
    console.log(placeName);
})

app.listen(5000, function () {
    console.log("Server started on port 5000");
})