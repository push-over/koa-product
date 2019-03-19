const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

// 导入配置文件
var Config = require('./config.js');

class Mongo {

  static getInstance() {
    /*1、单例  多次实例化实例不共享的问题*/
    if (!Mongo.instance) {
      Mongo.instance = new Mongo();
    }
    return Mongo.instance;
  }

  constructor() {
    this.dbClient = '';
    this.connect();
  }

  // 连接数据库
  connect() {
    let _that = this;
    return new Promise((resolve, reject) => {
      if (!_that.dbClient) {
        MongoClient.connect(Config.dbUrl, {
          useNewUrlParser: true
        }, (err, client) => {
          if (err) {
            reject(err)
          } else {
            _that.dbClient = client.db(Config.dbName);
            resolve(_that.dbClient)
          }
        });
      } else {
        resolve(_that.dbClient);
      }
    });
  }

  // 查询数据库
  find(tableName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        let result = db.collection(tableName).find(json);
        result.toArray(function (err, docs) {
          if (err) {
            reject(err);
            return;
          }
          resolve(docs);
        });
      });
    });
  }

  // 修改数据
  update(tableName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(tableName).updateOne(json1, {
          $set: json2
        }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  // 添加数据
  insert(tableName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(tableName).insertOne(json, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  // 删除数据
  remove(tableName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(tableName).removeOne(json, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  getObjectId(id) {
    return  new ObjectID(id);
  }
}


module.exports = Mongo.getInstance();