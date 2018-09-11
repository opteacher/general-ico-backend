const env = require("../utils/system").env();
const config = require(`../config/mail.${env}`).verifyCode;

module.exports = function () {
    let minLen = config.length.min;
    let maxLen = config.length.max;
    let len = Math.random() * (maxLen - minLen) + minLen;
    len = parseInt(len);

    let codeMap = "0123456789";
    if(config.contains.lowerCase) {
        codeMap += "abcdefghijklmnopqrstuvwxyz"
    }
    if(config.contains.upperCase) {
        codeMap += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    let code = "";
    for(let i = 0; i < len; ++i) {
        let idx = Math.random() * codeMap.length;
        code += codeMap[parseInt(idx)]
    }
    return code;
};