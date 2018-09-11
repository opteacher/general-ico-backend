const nodemailer = require("nodemailer");

const env = require("../utils/system").env();
const config = require(`../config/mail.${env}`).config;

const transporter = nodemailer.createTransport(config);

module.exports = function (to, subject, html) {
    return new Promise((res, rej) => {
        transporter.sendMail({
            from: config.auth.user,
            to,
            subject,
            html
        }, (err, resp) => err ? rej(err) : res(resp))
    })
};