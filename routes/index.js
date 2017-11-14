var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Puppeteer Sandbox' });
});

router.get('/puppeteer/:view', function(req, res, next) {
  res.render('puppeteer/' + req.params.view, { title: req.params.view + ' | Puppeteer' });
});

module.exports = router;

