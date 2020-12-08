const fs = require('fs');
const ejs = require('ejs');

//---------Read blog post content and convert to JS object
let site_content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));

//---------Generate index.html
let index_template = fs.readFileSync('src/views/index.ejs', 'utf8');
let index_html = ejs.render(index_template, {
  filename: __dirname + '/src/views/index.ejs',
  site_content: site_content
});
fs.writeFileSync('build/index.html', index_html, 'utf8');


//---------Generate about.html
let about_template = fs.readFileSync('src/views/about.ejs', 'utf8');
let about_html = ejs.render(about_template, {
  filename: __dirname + '/src/views/about.ejs',
  site_content: site_content
});
fs.writeFileSync('build/about.html', about_html, 'utf8');


//---------Generate all blog posts
site_content.blog_posts.forEach(function(post) {
  let post_template = fs.readFileSync('src/views/blog_post.ejs', 'utf8');
  let post_html = ejs.render(post_template, {
    filename: __dirname + '/src/views/blog_post.ejs',
    post: post,
    site_content: site_content
  });
  let filename = post.title.replace(/ /g, "-");
  fs.writeFileSync(`build/${filename}.html`, post_html, 'utf8');
})