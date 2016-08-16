const express = require('express');
const router = express.Router();

const contents = require('../src/contents.js');

router.get('/:lang/:slug.html', function(req, res, next) {
  contents.displayPage(req, res, next);
});

router.get('/:slug.html', function(req, res, next) {
  req.params.lang = 'fr';
  contents.displayPage(req, res, next);
});

router.get('/', function(req, res, next) {
  req.params.lang = 'fr';
  req.params.slug = 'index';
  contents.displayPage(req, res, next);
});

router.get('/en', function(req, res, next) {
  req.params.lang = 'en';
  req.params.slug = 'index';
  contents.displayPage(req, res, next);
});

module.exports = router;
