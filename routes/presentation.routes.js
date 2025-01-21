// presentationRoutes.js
const express = require('express');
const router = express.Router();
const presentationController = require('../controller/presentation.controller');

router.post('/presentation', presentationController.createPresentation);

router.get('/presentations', presentationController.findAll);

router.put('/presentation/:id', presentationController.updatePresentation);

router.delete('/presentation/:id', presentationController.deletePresentation);

module.exports = router;
