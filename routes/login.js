var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  console.log(req.json);
  console.log(req.params);

  return passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })(req, res, next);
});

router.get('/do', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

module.exports = router;
