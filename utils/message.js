const message = {
    // @block{getErrContent}:从错误对象中获取描述
    // @params{err}[object]:错误对象
    // @return{ret}[string]:错误描述
    getErrContent: err => {
        let ret = {};
        if(typeof err === "string") {
            ret = err;
        } else if(err.message && typeof err.message === "string") {
            ret = err.message;
        } else if(err.content && typeof err.content === "string") {
            ret = err.content;
        }
        return ret;
    }
};

module.exports = message;