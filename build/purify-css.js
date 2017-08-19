var purify = require('purify-css');
require('shelljs/global');

// purify style.css
exec('jekyll build', function(code, stdout, stderr) {
});

var content = [
    '_site/index.html',
    '_site/404.html',
    '_site/blog/index.html',
    '_site/linux/index.html',
    '_site/donate/index.html',
    '_site/html/2017/01/31/3-steps-to-setup-website-with-Jalpc.html',
    '_site/ai/2017/05/31/My-Coop-Experience-At-Scotiabank-ML-AI-Team.html'
]
var css = ['static/css/style.css']

var options = {
    output: 'static/css/style-purify.css'
};

purify(content, css, options);
