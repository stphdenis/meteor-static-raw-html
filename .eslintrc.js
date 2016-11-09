// npm install -g eslint eslint-config-airbnb eslint-plugin-react eslint-plugin-meteor eslint-plugin-html eslint-plugin-import eslint-plugin-jsx-a11y
// npm install -g eslint eslint-config-airbnb eslint-plugin-meteor eslint-plugin-html
module.exports = {
  "ecmaVersion": 6,
  "extends": [
    "airbnb/base", // sans react -> "airbnb/base", avec react -> "airbnb"
  ],
  "settings": {
    "html/report-bad-indent": 2,
  },
  "globals": {
    "Package": false,
    "Npm": false,
    "CachingCompiler": false,
    "CachingHtmlCompiler": false,
    "TemplatingTools": false,
    "HTMLTools": false,
    "Tinytest": false,
    "_": false,
  },
};
