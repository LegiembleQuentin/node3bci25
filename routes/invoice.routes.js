const express = require('express');
const router = express.Router();
const messageEmitter = require('../event');

// Invoice generation route
router.post('/generate-invoice', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is required');
    }
    messageEmitter.emit('generate-invoice', req.body);
    res.send('Invoice is being generated');
});

module.exports = router;
