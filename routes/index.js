const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const fs = require('fs');
const marked = require('marked');
const _ = require('lodash');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: false,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

const getFiles = (lang) => Promise.fromNode(cb => fs.readdir('./src/' + lang, cb));
const getContents = (path) => Promise.fromNode(cb => fs.readFile(path, cb))
.then(buffer => buffer.toString());

const parsePage = (contents) => {
  const elems = contents.toString().split('\r\n---\r\n')
  const pairs = elems[0].split('\r\n');
  pairs.shift();
  const metadata = _.fromPairs(pairs.map(x => x.split(':')).map(p => [p[0].trim(), p[1].trim()]));
  const markdown = elems[1];
  return {
    metadata,
    html: marked(markdown)
  };
}

const displayPage = (req, res, next) => {
  const lang = req.params.lang === 'en' ? 'en' : 'fr';
  getFiles(lang)
  .then(v => {
      const file = v.find(n => n === req.params.slug + ".markdown");
      return getContents(`./src/${lang}/${file}`); })
  .then(parsePage)
  .then(({metadata, html}) => {
    res.render('page', _.merge({lang}, metadata, { html }))
  })
  .catch(next);

}

router.get('/:lang/:slug.html', function(req, res, next) {
  displayPage(req, res, next);
});

router.get('/:slug.html', function(req, res, next) {
  req.params.lang = 'fr';
  displayPage(req, res, next);
});

router.get('/', function(req, res, next) {
  req.params.lang = 'fr';
  req.params.slug = 'index';
  displayPage(req, res, next);
});

module.exports = router;
