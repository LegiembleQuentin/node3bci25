const cryptoController = require('../controller/crypto.controller');
const express = require('express');
const router = express.Router();

router.post('/crypto', cryptoController.create);

router.get('/cryptos', cryptoController.findAll);

module.exports = router;
