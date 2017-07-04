const cheerio = require('cheerio');
const superagent = require('superagent');
require('superagent-charset')(superagent);
const q = require('q');

var pageCountData = {
  endPage: 1
};

const PAGE_TABLE_SIGN = 'table[summary="forum_557"]';

function filterText(text) {
  const $ = cheerio.load(text, {decodeEntities: false});
  $('a.nxt')[0] && (pageCountData.endPage = parseInt($('a.nxt')[0].prev.children[0].data.replace('...','').trim()));
  var tableStr = $(PAGE_TABLE_SIGN).html();
  tableStr = tableStr.replace(/<tbody>(.|\n)*?<\/tbody>/g, '').trim();
  tableStr = tableStr.replace(/<tbody.*?id="stickthread_(.|\n)*?<\/tbody>/g, '').trim();
  tableStr = tableStr.replace(/<tbody.*?id="separatorline"(.|\n)*?<\/tbody>/g, '').trim();
  tableStr = tableStr.replace(/<tbody.*?id="normalthread(.|\n)*?<\/td>/g, '').trim();
  tableStr = tableStr.replace(/<\/tr>/g, '').trim();
  return tableStr.split('</tbody>');
}

function htmlToObject(items) {
  var data = [];
  for (var i = 0; i < items.length - 2; i++) {
    var itemDom = cheerio.load(`<div>${items[i]}</div>`, {decodeEntities: false});
    var linkdom = itemDom('a');
    var emdom = itemDom('em');
    var linkdom2 = itemDom('a[c="1"]');
    var linkdom3 = itemDom('a.xi2');

    var type = linkdom[0].children[0].data || linkdom[0].children[0].children[0].data || linkdom[0].children[0].children[0].children[0].data;
    if (type == undefined || type == 'undefined') {
      console.log(type);
    }
    var title = linkdom[1].children[0].data;
    var link = linkdom[1].attribs.href;

    var lastCommitTime = emdom[emdom.length - 1].children[0].children[0].data;
    var publishTime = emdom[emdom.length - 3].children[0].children[0].data;
    var viewCount = emdom[emdom.length - 2].children[0].data;

    var lastCommitPeople = linkdom2[linkdom2.length - 1].children[0].data;
    var author = linkdom2[linkdom2.length - 2].children[0].data;

    var replyCount = linkdom3[linkdom3.length - 1].children[0].data;

    data.push({
      type,
      title,
      link,
      lastCommitTime,
      publishTime,
      viewCount,
      lastCommitPeople,
      author,
      replyCount
    });
  }
  return data;
}


module.exports = {
  fn:function(url) {
    var d = q.defer();
    superagent.get(url).charset('gbk').end(function(err, sres) {
      if (err) {
        console.log(err);
        d.reject(err);
      } else {
        var html = sres.text;
        var items = filterText(html);
        var pageData = htmlToObject(items);
        d.resolve(pageData);
      }
    });
    return d.promise;
  },
  pageCountData
};
