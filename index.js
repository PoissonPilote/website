const marked = require('marked');
const fs = require('fs');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

fs.readFile('./en/contact.markdown', (err, data) => {
  const elems = data.toString().split('\r\n---\r\n')
  const pairs = elems[0];
  const markdown = elems[1];
  console.log(marked(markdown));
});
