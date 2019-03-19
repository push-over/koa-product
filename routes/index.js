const router = require('koa-router')();

router.get('/', async (ctx) => {
  ctx.body='index';
});

module.exports = router.routes();