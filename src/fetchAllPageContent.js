const sqlclient = require('./sqlclient');
const getPageContent = require('./getPageContent');
const htmlToText = require('html-to-text');
const log = require('./log');
const q = require('q');
var colors = require('colors/safe');

function getAllPageContent(data, index) {
  var d = q.defer();
  log.yellow(`获取第 ${colors.cyan(index + 1)} 个帖子,进度：${colors.magenta(`${index + 1}/${data.length}`)}.`);
  if (data.length == 0) {
    d.resolve();
  } else {
    getPageContent(data[index].link).then(result => {
      var text = htmlToText.fromString(result, {wordwrap: 130}).replace(/[\r\n\s\f\t\v\o]+/gm, "");
      var commitData = {
        pageContent: text.replace(/'/g, ""),
        id: data[index].id,
        link: data[index].link
      };
      sqlclient.update(commitData);
      if (index < data.length - 1) {
        return d.resolve(getAllPageContent(data, ++index));
      } else {
        d.resolve();
      }
    });
  }
  return d.promise;
}

module.exports = function(startIndex) {
  var index = startIndex || 0;
  var d = q.defer();
  sqlclient.getAllPageInfo().then(data => {
    getAllPageContent(data, index). finally(data => {
      d.resolve();
    });
  });
  return d.promise;
};
