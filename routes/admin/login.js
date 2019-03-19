const router = require('koa-router')();

const tools = require('../../model/tools'),
  mongo = require('../../model/mongodb');

// 登录
router.get('/', async (ctx) => {
  await ctx.render('admin/login');
});

router.post('/doLogin', async (ctx) => {
  const userInfo = {
    username: ctx.request.body.username,
    password: tools.md5(ctx.request.body.password)
  };
  const result = await mongo.find('user', userInfo);
  if (result.length > 0) {
    console.log('成功');
    ctx.session.userinfo = result[0];
    ctx.redirect(ctx.state.__HOST__ + '/admin/product');
  } else {
    console.log('失败');
    ctx.render('admin/login');
  }
});

module.exports = router.routes();