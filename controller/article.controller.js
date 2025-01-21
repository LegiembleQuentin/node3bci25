const Article = require("../model/Article");

exports.findAll = async (req, res) => {
    let articles = await Article.find();
    res.json(articles);
}
