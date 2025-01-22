const express = require('express');
const router = express.Router();
const Article = require('../model/Article');
const logger = require('../config/logger');
const ArticleController = require('../controller/article.controller');

router.get("/articles", async (req, res) => {
    ArticleController.findAll(req, res);
});
router.get("/articles/test", async (req, res) => {
    res.send("Test route");
    logger.emit('crit', 'Test route erreur crit');
});


module.exports = router;
