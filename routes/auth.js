// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login', {
      errorMessage: ''
    });
  });

router.post('/signup', (req, res, next) => {
    const {name, email, password} = req.body;
  
    if (email === '' || password === '') {
      res.render('auth/signup', {
        errorMessage: 'Enter both email and password to sign up.'
      });
      return;
    }
  
    User.findOne({ email }, '_id', (err, existingUser) => {
      if (err) {
        next(err);
        return;
      }
  
      if (existingUser !== null) {
        res.render('auth/signup', {
          errorMessage: `The email ${email} is already in use.`
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(password, salt);
    
      const theUser = new User({
        name,
        email,
        password: hashedPass
      });
  
      theUser.save((err) => {
        if (err) {
          res.render('auth/signup', {
            errorMessage: `Something went wrong. Try again later. + ${err}`,
          });
          return;
        }
  
        res.redirect('/');
      });
    });
  });

  router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
  
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Enter both email and password to log in.'
      });
      return;
    }
  
    User.findOne({ email }, (err, theUser) => {
      if (err || theUser === null) {
        res.render('auth/login', {
          errorMessage: `There isn't an account with email ${email}.`
        });
        return;
      }
  
      if (!bcrypt.compareSync(password, theUser.password)) {
        res.render('auth/login', {
          errorMessage: 'Invalid password.'
        });
        return;
      }
  
      req.session.currentUser = theUser;
      res.redirect('/');
    });
  });

  router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
  
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
  
      res.redirect('/');
    });
  });

module.exports = router;