const _ = require("lodash");
const router = require("koa-router")();

const system = require("../../../../utils/system");
const projPath = system.projRootPath();
const db = require(`${projPath}/databases/mongo`);
const { Users, Addresses } = require(`${projPath}/models/index`);

// @block{api_v1_user_log_up}:用户注册
// @params{request_body}[object]:登录表单
//                  * *icoAddr*[```string```]：用户填写的ICO地址
// @return{response_body}[object]:登录结果
//                  * *status*[```number```]：操作code
//                  * *result*[```string```]：用户详情/失败
//                  * *message*[```string```]：失败的原因
router.put("/:uid", async ctx => {
    // @step{1}:检测用户名是否存在
    let result = await db.select(Users, {id: ctx.params.uid});
    if(result.length === 0) {
        ctx.throw(400, "failed", "用户不存在")
    }
    // @step{2}:查询用户是否已经有ICO的地址了
    let dbUser = result[0];
    if(dbUser.icoAddr) {
        ctx.throw(400, "failed", "用户已经拥有ICO地址了")
    }
    // @step{3}:从地址表请求BTC、ETH、ETP的地址（+_+：存入地址表必须附带一个空的uid字段）
    result = await db.select(Addresses, {uid: ""});
    if(result.length === 0) {
        ctx.throw(400, "failed", "没有可用的BTC/ETH/ETP地址了")
    }

    // @step{4}:将用户id保存进地址表的某条可用的记录中
    let dbAddr = await db.save(Addresses, {
        uid: ctx.params.uid
    }, {uid: ""}, {onlyOne: true});
    // @step{5}:将BTC/ETH/ETP和ICO的地址更新到该用户记录
    let reqBody = ctx.request.body;
    result = await db.save(Users, _.assign(reqBody, {
        btcAddr: dbAddr.btcAddr,
        ethAddr: dbAddr.ethAddr,
        etpAddr: dbAddr.etpAddr,
    }), {id: ctx.params.uid}, {cvtId: true});
    dbUser = result[0].toObject();
    // @step{6}:返回更新过的用户信息
    delete dbUser.password;
    dbUser.uid = dbUser._id;
    delete dbUser._id;
    ctx.body = {
        status: 200,
        result: dbUser,
        message: "更新成功"
    }
});

router.get("/:uid", async ctx => {
    // @step{1}:查找用户的所有地址，如果不存在，报错
    let result = await db.select(Users, {id: ctx.params.uid});
    if(result.length === 0) {
        ctx.throw(400, "failed", "用户不存在")
    }
    let dbUser = result[0];
    ctx.body = {
        status: 200,
        result: {
            icoAddr: dbUser.icoAddr,
            btcAddr: dbUser.btcAddr,
            ethAddr: dbUser.ethAddr,
            etpAddr: dbUser.etpAddr
        },
        message: "查询成功"
    }
});

module.exports = router;