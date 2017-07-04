const q = require('q');
const moment = require('moment');

var sqlClient = require("./sqlClient");

var client = new sqlClient({
  mysql: {
    host: "10.20.66.244",
    port: 3306,
    database: "pcbeta",
    user: "root",
    charset: 'utf8mb4',
    password: "ljj123"
  }
});

function save(data) {
  var d = q.defer();
  client.query(`SELECT id from sierra WHERE link='${data.link}'`, [1]).then(function(result) {
    if (result.length > 0) {
      d.resolve(update(data));
    } else {
      d.resolve(insert(data));
    }
  }, function(error) {
    d.reject(error);
  });
  return d.promise;
}

function insert(data) {
  var d = q.defer();
  var keystr = ``;
  var datastr = ``;
  for (var i in data) {
    keystr += `,${i}`;
    datastr += `,'${data[i]}'`;
  }
  keystr = keystr.slice(1);
  datastr = datastr.slice(1);
  client.query(`INSERT INTO sierra (${keystr}) VALUES (${datastr})`, [1]).then(function(result) {
    d.resolve(result);
  }, function(error) {
    d.reject(error);
  });
  return d.promise;
}

function update(data) {
  var d = q.defer();
  var str = ``;
  for (var i in data) {
    str += `,${i} = '${data[i]}'`;
  }
  str = str.slice(1);
  client.query(`UPDATE  sierra SET ${str} WHERE id = '${data.id}'`, [1]).then(function(result) {
    d.resolve(result);
  }, function(error) {
    d.reject(error);
  });
  return d.promise;
}

function getAllPageInfo() {
  var d = q.defer();
  var timeBefore5Day = moment(new Date() - 5 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
  client.query(`select * from sierra WHERE ISNULL(pageContent) or DATE_FORMAT(lastCommitTime,'%Y-%m-%d') >= '${timeBefore5Day}'`, [1]).then(result => {
    d.resolve(result);
  }, error => {
    console.log(error);
    d.reject(error);
  });
  return d.promise;
}

module.exports = {
  save,
  insert,
  update,
  getAllPageInfo,
  close: client.close
};
