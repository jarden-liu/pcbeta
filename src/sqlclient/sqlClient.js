var mysql = require('mysql');
const q = require('q');

module.exports = function(option) {
  this._option = option;
  var connected = false;
  var connection = mysql.createConnection(this._option.mysql);
  this.connect = connection.connect;
  this.query = function(sql) {
    var d = q.defer();
    if (connected) {
      connection.query(sql, function(error, results, fields) {
        if (error) {
          d.reject(error);
        } else {
          d.resolve(results);
        }
      });
    } else {
      connection.connect(function(err) {
        if (err) {
          d.reject(err);
        } else {
          connected = true;
          connection.query(sql, function(error, results, fields) {
            if (error) {
              d.reject(error);
            } else {
              d.resolve(results);
            }
          });
        }
      });
    }
    return d.promise;
  };
  this.close = connection.end;
};
