const cheerio = require('cheerio');
const superagent = require('superagent');
const q = require('q');
require('superagent-charset')(superagent);

function getContent(url) {
  var d = q.defer();
  var pageCount = 1;
  var content = '';
  fetchPage(url, 1);

  function filterText(text) {
    if(text.match(/指定的主题正在被审核或不存在或已被删除/)){
      return;
    }
    const $ = cheerio.load(text, {decodeEntities: false});
    var tableStr = $('td.t_f');
    pageCount = $('a.nxt')[0] && $('a.nxt')[0].prev.children[0].data;
    content += tableStr;
  }

  function fetchPage(url, index) {
    var newUrl = url.replace(/-1-/, `-${index}-`);
    superagent.get(newUrl).charset('gbk').end(function(err, sres) {
      if (err) {
        if (err.status == 404) {
          d.resolve('<p>指定的主题正在被审核或不存在或已被删除</p>');
        }else{
          d.reject(err);
        }
      } else {
        var html = sres.text;
        filterText(html);
        if (index < pageCount) {
          fetchPage(url, ++index);
        } else {
          d.resolve(content);
        }
      }
    });
  }
  return d.promise;
}

module.exports = getContent;
