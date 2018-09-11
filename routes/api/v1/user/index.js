const router = require("koa-router")();

const system = require("../../../../utils/system");
const projPath = system.projRootPath();
const db = require(`${projPath}/databases/mongo`);
const { VerifyCodes, Users, Addresses } = require(`${projPath}/models/index`);

// @block{api_v1_user}:提交用户表单
// @params{request_body}[object]:提交表单
//                  * *email*[```string```]：邮箱地址
//                  * *icoAddr*[```string```]：ICO地址
//                  * *verifyCode*[```string```]：验证码
// @return{response_body}[object]:提交结果
//                  * *status*[```number```]：操作code
//                  * *result*[```string```]：用户详情/失败
//                  * *message*[```string```]：失败的原因
router.post("/", async ctx => {
    // @step{1}:校验参数和校验码是否正确
    let reqBody = ctx.request.body;
    let result = null;
    try {
        result = await db.select(VerifyCodes, {
            email: reqBody.email
        })
    } catch (e) {
        ctx.throw(400, "failed", e)
    }
    if(!result || result.length === 0) {
        ctx.throw(400, "failed", "请先校验邮箱")
    }
    result = result[result.length - 1];
    if(result.code !== reqBody.verifyCode) {
        ctx.throw(400, "failed", "验证码不正确")
    }
    await db.delete(VerifyCodes, {email: reqBody.email});
    // @step{2}:新增用户
    try {
        result = await db.save(Users, {
            email: reqBody.email,
            icoAddr: reqBody.icoAddr
        })
    } catch (e) {
        ctx.throw(400, "failed", e)
    }
    let uid = result._id;
    // @step{3}:给新用户分配BTC/ETH/ETP地址
    let dbUser = null;
    try {
        result = await db.select(Addresses, {uid: ""});
        if(result.length === 0) {
            ctx.throw(400, "failed", "没有可用的BTC/ETH/ETP地址了")
        }
        let dbAddr = await db.save(Addresses, {uid}, {
            uid: ""
        }, {onlyOne: true});
        result = await db.save(Users, {
            btcAddr: dbAddr.btcAddr,
            ethAddr: dbAddr.ethAddr,
            etpAddr: dbAddr.etpAddr,
        }, {id: uid}, {cvtId: true});
        dbUser = result[0].toObject();
    } catch (e) {
        ctx.throw(400, "failed", e)
    }
    // @step{4}:返回更新过的用户信息
    delete dbUser.password;
    dbUser.uid = dbUser._id;
    delete dbUser._id;
    ctx.body = {
        status: 200,
        result: dbUser,
        message: "提交成功"
    }
});

module.exports = router;