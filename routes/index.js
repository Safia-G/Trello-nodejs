var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
  console.log(req.session)
  if(!req.session || !req.session.user)
    res.cookie('loggedIn', '')
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trello', user:req.session.user || {} });
});

module.exports = router;
