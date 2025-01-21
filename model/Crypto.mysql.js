const sql = require("../config/db.js");

const Crypto = function(crypto) {
    this.name = crypto.name;
    this.price = crypto.price;
    this.currency = crypto.currency;
}

Crypto.create = (newCrypto, result) => {
    sql.query("INSERT INTO crypto SET ?", newCrypto, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created crypto: ", { id: res.insertId, ...newCrypto });
        result(null, { id: res.insertId, ...newCrypto });
    });
}

Crypto.findById = (cryptoId, result) => {
    sql.query(`SELECT * FROM crypto WHERE id = ${cryptoId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found crypto: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
}

Crypto.getAll = result => {
    sql.query("SELECT * FROM crypto", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("crypto: ", res);
        result(null, res);
    });
}

Crypto.updateById = (id, crypto, result) => {
    sql.query(
        "UPDATE crypto SET name = ?, price = ?, currency = ? WHERE id = ?",
        [crypto.name, crypto.price, crypto.currency, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated crypto: ", { id: id, ...crypto });
            result(null, { id: id, ...crypto });
        }
    );
}

Crypto.remove = (id, result) => {
    sql.query("DELETE FROM crypto WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted crypto with id: ", id);
        result(null, res);
    });
}

module.exports = Crypto;
