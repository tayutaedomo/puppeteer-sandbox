var express = require('express');
var validUrl = require('valid-url');
var puppeteer = require('puppeteer');
var _ = require('underscore');

var router = express.Router();


var parseUrl = function(url) {
  url = decodeURIComponent(url);
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'http://' + url;
  }

  return url;
};

// Refer: https://timleland.com/headless-chrome-on-heroku/
router.post('/capture', function(req, res, next) {
  var urlToScreenshot = parseUrl(req.body.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log('Screenshotting: ' + urlToScreenshot);
    (async() => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.goto(urlToScreenshot);
      await page.screenshot().then(function(buffer) {
        res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer)
      });

      await browser.close();
    })();

  } else {
    res.send('Invalid url: ' + urlToScreenshot);
  }
});

router.post('/capture_viewport', function(req, res, next) {
  var urlToScreenshot = parseUrl(req.body.url);

  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log('Screenshotting: ' + urlToScreenshot);
    (async() => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      await page.goto(urlToScreenshot);

      let viewport = {
        width: parseInt(req.body.width),
        height: parseInt(req.body.height),
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      };
      await page.setViewport(viewport);

      await page.screenshot().then(function(buffer) {
        res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer)
      });

      await browser.close();
    })();

  } else {
    res.send('Invalid url: ' + urlToScreenshot);
  }
});

router.get('/:view', function(req, res, next) {
  res.render('puppeteer/' + req.params.view, { title: req.params.view + ' | Puppeteer' });
});


module.exports = router;

