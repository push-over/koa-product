const router = require('koa-router')(),
  url = require('url');

const login = require('./admin/login'),
  product = require('./admin/product');

router.use(async (ctx, next) => {
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
  
  const pathname = url.parse(ctx.request.url).pathname;

  if (ctx.session.userinfo) {
    await next();
  } else {
    if (pathname == '/admin/login' || pathname == '/admin/login/doLogin') {
      await next();
    } else {
      ctx.redirect('/admin/login');
    }
  }
});

router.use('/login', login);
router.use('/product', product);

module.exports = router.routes();