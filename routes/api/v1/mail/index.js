const router = require("koa-router")();

const system = require("../../../../utils/system");
const projPath = system.projRootPath();
const mailContent = require(`${projPath}/config/mail.${system.env()}`).html;
const sendEmail = require(`${projPath}/mails/index`);
const genVerifyCode = require(`${projPath}/mails/verifyCode`);
const db = require(`${projPath}/databases/mongo`);
const { VerifyCodes } = require(`${projPath}/models/index`);

// @block{api_v1_mail}:接收邮箱，发送验证码
// @params{request_body}[object]:校验表单
//                  * *email*[```string```]：用户填写的邮箱地址
// @return{response_body}[object]:校验结果
//                  * *status*[```number```]：操作code
//                  * *result*[```string```]：空
//                  * *message*[```string```]：失败的原因
router.post("/", async ctx => {
    // @step{1}:验证参数
    let reqBody = ctx.request.body;
    if(!reqBody.email) {
        ctx.throw(400, "failed", "请指定email地址")
    }
    // @step{1}:生成验证码
    let verifyCode = genVerifyCode();
    // @step{2}:存入数据库
    let result = null;
    try {
        result = await db.save(VerifyCodes, {
            email: reqBody.email,
            code: verifyCode
        })
    } catch (e) {
        ctx.throw(400, "failed", e)
    }
    if(!result || result.length === 0) {
        ctx.throw(400, "failed", "数据库存入失败：验证码save错误")
    }
    // @step{3}:填入html模板，发送验证邮件
    let html = mailContent.template;
    html = html.replace(mailContent.verifyCodeSlot, verifyCode);
    try {
        result = await sendEmail(reqBody.email, "验证邮件", html);
    } catch (e) {
        ctx.throw(400, "failed", e)
    }
    // @step{4}:返回
    ctx.body = {
        status: 200,
        result: "发送验证邮件成功",
        message: ""
    }
});

module.exports = router;