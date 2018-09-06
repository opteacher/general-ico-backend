const crypto = require("crypto");
const db = require("../databases/mongo");

module.exports = db.defineModel({
    __modelName:    "user",
    username:   db.Types.String,
    password:   db.Types.String,
    icoAddr:    db.Types.String,
    btcAddr:    db.Types.String,
    ethAddr:    db.Types.String,
    etpAddr:    db.Types.String,
}, {
    middle: {
        create: {
            before: function(doc) {
                doc.password = crypto.createHash("sha1").update(doc.password).digest("hex");
            }
        }
    }
});