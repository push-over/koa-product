const md5 = require('md5');

let tools = {
  md5(str) {
    return md5(str);
  },
  getCaption(obj) {
    var index = obj.indexOf("\/upload");
    obj = obj.substring(index, obj.length);
    return obj;
  }
};

module.exports = tools;