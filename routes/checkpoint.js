const express = require('express');
const User = require('../models/user');
const checkpoint = require('../models/checkpoint');

const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});


router.get('/dashboard', (req, res, next) => {

  checkpoint.find({user:req.session.currentUser._id})
  .then(checkpoints => {
    res.render("../views/checkpoint/dashboard.hbs", { checkpoints });
  })
  .catch(error => {
    console.log(error)
  })
});


router.post('/dashboard', (req, res, next) => {
    const checkpointInfo = {
      user: req.session.currentUser._id ,
      weight: req.body.weight,
      bf: req.body.bf,
      fat: (req.body.weight)*((req.body.bf)/100),
      lbm: (req.body.weight)-((req.body.weight)*((req.body.bf)/100)),
    };
    const theCheckpoint = new checkpoint(checkpointInfo);
    theCheckpoint.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/dashboard');
    });
  });



module.exports = router;