const db = require("../databases/mongo");

module.exports = db.defineModel({
    __modelName:    "address",
    uid:        db.Types.String,
    btcAddr:    db.Types.String,
    ethAddr:    db.Types.String,
    etpAddr:    db.Types.String,
});