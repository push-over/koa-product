const router = require('koa-router')(),
  multer = require('koa-multer'),
  fs = require('fs');

// 引入mongo
const mongo = require('../../model/mongodb'),
  tools = require('../../model/tools');

// 生成文件名
const storage = multer.diskStorage({
  destination: 'cms/public/upload/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate(),
  filename(ctx, file, cb) {
    const filenameArr = file.originalname.split('.');
    cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
  }
});

let upload = multer({storage: storage});

// 商品列表
router.get('/', async (ctx) => {
  await mongo.find('product', {}).then((data) => {
    ctx.render('admin/product/index', {
      list: data
    });
  });
});

// 添加商品
router.get('/add', async (ctx) => {
  await ctx.render('admin/product/add');
});

router.post('/doAdd', upload.single('pic'), async (ctx) => {
  let title = ctx.req.body.title;
  let price = ctx.req.body.price;
  let fee = ctx.req.body.fee;
  let description = ctx.req.body.description;
  let pic = tools.getCaption(ctx.req.file.path);
  await mongo.insert('product', {
    title, price, fee, description, pic
  }).then((data) => {
    ctx.redirect(ctx.state.__HOST__ + '/admin/product');
  })
});

// 修改商品
router.get('/edit', async (ctx) => {
  let id = JSON.parse(ctx.request.query.id);
  await mongo.find('product', {"_id": mongo.getObjectId(id)}).then((data) => {
    ctx.render('admin/product/edit', {
      data: data[0]
    });
  });
});

router.post('/doEdit', upload.single('pic'), async (ctx) => {
  let id = JSON.parse(ctx.req.body._id);
  let title = ctx.req.body.title;
  let price = ctx.req.body.price;
  let fee = ctx.req.body.fee;
  let description = ctx.req.body.description;
  let pic = tools.getCaption(ctx.req.file.path);
  if (ctx.req.file.originalname) {
    var productData = {
      title, price, fee, description, pic
    };
  } else {
    var productData = {
      title, price, fee, description
    };
    fs.unlink(pic, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
  await mongo.update('product', {"_id": mongo.getObjectId(id)}, productData)
    .then((data) => {
      ctx.redirect(ctx.state.__HOST__ + '/admin/product');
    })
});

// 删除商品
router.get('/delete', async (ctx) => {
  let id = JSON.parse(ctx.request.query.id);
  await mongo.remove('product', {"_id": mongo.getObjectId(id)}).then((data) => {
    ctx.redirect(ctx.state.__HOST__ + '/admin/product');
  });
});

module.exports = router.routes();