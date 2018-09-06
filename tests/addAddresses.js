const db = require("../databases/mongo");
const { Addresses } = require("../models/index");

(async () => {
    await db.save(Addresses, {
        uid: "",
        btcAddr: "2MscuBnDRh6PR7UkALXYLYgPyiiJBiVswPK",
        ethAddr: "0x1c6f567e577a351917615fb1c8f1222dc96ba18d",
        etpAddr: "MAmHAQd9hUmHG7EbnUvQ1pg2s3Tyd2tdjf"
    })
})();