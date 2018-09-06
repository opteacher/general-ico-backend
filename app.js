/***
 * 作者：opteacher
 * 日期：2018/07/06
 ***/
const Koa = require("koa");
// 用于旧版本模块的generator向async/await转换
const convert = require("koa-convert");
const bodyparser = require("koa-bodyparser");
const json = require("koa-json");
const logger = require("koa-logger");
const cors = require("koa2-cors");

const config = require("./config/server");
const models = require("./models/index").index;
const router = require("./routes/index");

const app = new Koa();

// 跨域配置
app.use(cors());

// 路径解析
app.use(bodyparser());

// json解析
app.use(json());

// 日志输出
app.use(logger());

// 模型路由
app.use(models.routes(), models.allowedMethods());

// 路径分配
app.use(router.routes(), router.allowedMethods());

// 错误跳转
app.use(ctx => {
    ctx.status = 404;
    ctx.body = "error";
});

app.listen(process.env.PORT || config.port);