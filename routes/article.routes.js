const express = require('express');
const router = express.Router();
const Article = require('../model/Article');
const ArticleController = require('../controller/article.controller');

router.get("/articles", async (req, res) => {
    ArticleController.findAll(req, res);
});
router.get("/articles/test", async (req, res) => {
    res.send("Test route");
});


module.exports = router;
