const cryptoController = require('../controller/crypto.controller');
const express = require('express');
const router = express.Router();
const cors = require('cors');

router.post('/crypto', cryptoController.create);

//prends en compte toutes les origines pour cette routes
router.get('/cryptos',cors(), cryptoController.findAll);

module.exports = router;
