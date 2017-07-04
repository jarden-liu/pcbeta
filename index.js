const fetchData = require('./src/fetchData');
const sqlclient = require('./src/sqlclient');
const fetchAllPageContent = require('./src/fetchAllPageContent');
var colors = require('colors/safe');
const log = require('./src/log');

log.bgBlack.white('==============脚本开始===============');
log.bgBlack.white('=========获取帖子列表信息============');

fetchDatas(1);
function fetchDatas(page) {
  log.gray(`正在获取第${page}个列表页面: ` + colors.underline.blue(`http://bbs.pcbeta.com/forum-557-${page}.html`));
  var url = `http://bbs.pcbeta.com/forum-557-${page}.html`;
  fetchData.fn(url).then(dataList => {
    log.gray(`页面帖子数量为       : ${colors.green(dataList.length)}`);
    saveDataList(dataList, 0);
  }). finally(t => {
    if (page < fetchData.pageCountData.endPage) {
    // if (page < 2) {
      fetchDatas(page + 1);
    } else {
      log.bgBlack.white('========获取帖子列表信息结束=========');
      log.bgBlack.white('=====================================');
      log.bgBlack.white('=========获取全部帖子回复内容========');
      fetchAllPageContent(0).finally(data=>{
        log.bgBlack.white('=========获取全部帖子内容结束========');
        log.bgBlack.white('==============脚本结束===============');
        process.exit(0);
      });
    }
  });
}

function saveDataList(dataList, index) {
  sqlclient.save(dataList[index]). finally(log => {
    if (dataList.length > index) {
      saveDataList(dataList, ++index);
    }
  });
}
