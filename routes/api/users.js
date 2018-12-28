const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/users');

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users));
});

router.post('/register', (req, res) => {

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
// Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            });
        });
    });
});


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email,password,done){
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect Email.' });
            }
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect password.'});
                }
            });


        });

    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json({failed:'Login Failed'}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({ id:req.user.id });
        });
    })(req, res, next);
});
router.get(
    "/currentuser",
    passport.authenticate("jwt", { session: false }, (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    })

);

module.exports = router;