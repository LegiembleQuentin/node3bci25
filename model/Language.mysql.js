const sql = require("../config/db.js");

// Constructor
const Language = function(language) {
    this.name = language.name;
    this.difficulty = language.difficulty;
};

// Create a new Language
Language.create = (newLanguage, result) => {
    sql.query("INSERT INTO language SET ?", newLanguage, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created language: ", { id: res.insertId, ...newLanguage });
        result(null, { id: res.insertId, ...newLanguage });
    });
};

// Find a Language by ID
Language.findById = (languageId, result) => {
    sql.query(`SELECT * FROM language WHERE id = ${languageId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found language: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};

// Get all Languages
Language.getAll = result => {
    sql.query("SELECT * FROM language", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("languages: ", res);
        result(null, res);
    });
};

// Update a Language by ID
Language.updateById = (id, language, result) => {
    sql.query(
        "UPDATE language SET name = ?, difficulty = ? WHERE id = ?",
        [language.name, language.difficulty, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated language: ", { id: id, ...language });
            result(null, { id: id, ...language });
        }
    );
};

// Delete a Language by ID
Language.remove = (id, result) => {
    sql.query("DELETE FROM language WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted language with id: ", id);
        result(null, res);
    });
};

Language.getAllPaginated = (limit, offset, result) => {
    sql.query(
        "SELECT * FROM language LIMIT ? OFFSET ?",
        [limit, offset],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("languages: ", res);
            result(null, res);
        }
    );
};

module.exports = Language;
