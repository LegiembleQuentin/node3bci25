const Language = require("../model/Language.mysql.js");
const Redis = require("ioredis");
const redis = new Redis();

// Créer un nouveau Language
exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const language = new Language({
        name: req.body.name,
        difficulty: req.body.difficulty
    });

    Language.create(language, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Language."
            });

        // Invalidate cache for the list
        redis.del('languages');

        res.send(data);
    });
};

// Récupérer tous les Languages avec pagination
exports.findAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page par défaut : 1
    const limit = parseInt(req.query.limit) || 10; // Limite par défaut : 10
    const offset = (page - 1) * limit;
    const cacheKey = `languages_page_${page}_limit_${limit}`;

    // Vérifier si les données sont dans Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        console.log("Data found in cache.");
        return res.json(JSON.parse(cachedData));
    }

    Language.getAllPaginated(limit, offset, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving languages."
            });

        // Mettre les données en cache Redis
        redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // Expiration : 1 heure
        res.send(data);
    });
};

// Récupérer un Language par ID
exports.findOne = async (req, res) => {
    const id = req.params.id;
    const cacheKey = `language_${id}`;

    // Vérifier si le language est dans Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        console.log("Data found in cache.");
        return res.json(JSON.parse(cachedData));
    }

    Language.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Language not found with id ${id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving Language with id " + id
                });
            }
        }

        // Mettre en cache le Language trouvé
        redis.set(cacheKey, JSON.stringify(data), 'EX', 3600); // Expiration : 1 heure
        res.send(data);
    });
};

// Mettre à jour un Language par ID
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const id = req.params.id;

    Language.updateById(id, new Language(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Language not found with id ${id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error updating Language with id " + id
                });
            }
        }

        // Invalidate cache for this Language and the list
        redis.del(`language_${id}`);
        redis.del('languages');

        res.send(data);
    });
};

// Supprimer un Language par ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Language.remove(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Language not found with id ${id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete Language with id " + id
                });
            }
        }

        // Invalidate cache for this Language and the list
        redis.del(`language_${id}`);
        redis.del('languages');

        res.send({ message: "Language was deleted successfully!" });
    });
};
