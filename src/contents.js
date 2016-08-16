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

const getPosts = (lang) => {
  const files = Promise.fromNode(cb => fs.readdir('./src/' + lang + '/_posts', cb));
  return files.then(files => Promise.all(files.map(getPost(lang))));
}
const getPost = (lang) => (file) => {
  return getContents(`./src/${lang}/_posts/${file}`)
    .then(parsePage)
}

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
  const index = req.params.slug === 'index';
  if(!index) {
    displayRegularPage(lang, req.params.slug, res, next);
  } else {
    displayIndex(lang, res, next);
  }
}

const displayRegularPage = (lang, slug, res, next) => {
  getFiles(lang)
  .then(v => {
      const file = v.find(n => n === slug + ".markdown");
      return getContents(`./src/${lang}/${file}`); })
  .then(parsePage)
  .then((metadata, html) => {
    res.render('page', _.merge({lang}, metadata, { html, index: false }))
  })
  .catch(next);
};

const displayIndex = (lang, res, next) => {
  const content = getContents(`./src/${lang}/index.markdown`).then(parsePage);
  const data = Promise.props({
    content,
    posts: getPosts(lang)
  });

  data
    .then(({content, posts}) => {
      res.render('index', _.merge({lang}, content.metadata, {html: content.html, index: true, posts}))
    })
    .catch(next);
}

module.exports = {
  displayPage
};
