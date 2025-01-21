const Crypto = require("../model/Crypto.mysql.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const crypto = new Crypto({
        name: req.body.name,
        price: req.body.price,
        currency: req.body.currency
    });

    Crypto.create(crypto, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Crypto."
            });
        else res.send(data);
    });
}

exports.findAll = (req, res) => {
    Crypto.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving cryptos."
            });
        else res.send(data);
    });
}
