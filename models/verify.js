const crypto = require("crypto");
const db = require("../databases/mongo");
const env = require("../utils/system").env();
const config = require(`../config/mail.${env}`).verifyCode;

module.exports = db.defineModel({
    __modelName:    "verify",
    email:      db.Types.String,
    code:       db.Types.String,
    createdAt:  db.Types.Date
}, {
    middle: {
        create: {
            before: function(doc) {
                doc.createdAt = new Date()
            }
        }
    },
    index: {
        indexes: [{createdAt: 1}],
        options: {expireAfterSeconds: config.expSeconds}
    }
});