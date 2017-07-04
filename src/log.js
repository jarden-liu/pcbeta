const LOG_SWITCH = true;
const LOG_TYPE = JSON.parse('["black","red","green","yellow","blue","magenta","cyan","white","gray","grey","bgBlack","bgRed","bgGreen","bgYellow","bgBlue","bgMagenta","bgCyan","bgWhite","reset","bold","dim","italic","underline","inverse","hidden","strikethrough","rainbow","zebra","america","trap","random","Usage"]');
var colors = require('colors/safe');


//递增打印
var log = {};
LOG_TYPE.map(type => {
  var fn = function (text) {
    LOG_SWITCH && console.log(colors[type](text));
  };
  LOG_TYPE.map(t => {
    fn[t] = function (text) {
      fn(colors[t](text));
    };
    LOG_TYPE.map(t2 => {
      fn[t][t2] = function (text) {
        fn[t](colors[t2](text));
      };
    });
  });
  log[type] = fn;
});
module.exports = log;
