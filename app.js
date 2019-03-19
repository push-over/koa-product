// 引入模块
const Koa = require('koa'),
  app = new Koa(),
  path = require('path'),
  router = require('koa-router')(),
  render = require('koa-art-template'),
  session = require('koa-session'),
  bodyParser = require('koa-bodyparser');

const index = require('./routes/index'),
  admin = require('./routes/admin');

// middlewares
app.use(bodyParser());

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 864000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   
    renew: false,
};
app.use(session(CONFIG, app));

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV != 'production'
});

app.use(require('koa-static')(__dirname + '/public'));

router.use('/admin', admin);
router.use(index);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, '127.0.0.1');