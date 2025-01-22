const languageController = require('../controller/language.controller');
const express = require('express');
const router = express.Router();
const cors = require('cors');


router.post('/language', languageController.create);

router.get('/languages', languageController.findAll);

router.get('/language/:id', languageController.findOne);

router.put('/language/:id', languageController.update);

router.delete('/language/:id', languageController.delete);

module.exports = router;
