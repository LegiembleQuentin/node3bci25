const Presentation = require('../model/Presentation');
// const logger = require('../config/logger');
const log = require ('../config/logFunction');
const Article = require("../model/Article"); // Adjust the path to where you've configured your logger

exports.createPresentation = async (req, res) => {
    try {
        const newPresentation = new Presentation(req.body);
        await newPresentation.save();
        res.status(201).send(newPresentation);
    } catch (error) {
        log.writeLog('server.log', `Error creating presentation: ${error.message}`)
        res.status(400).send(error);
    }
};

exports.findAll = async (req, res) => {
    try {
        let presentations = await Presentation.find();
        res.json(presentations);
    } catch (error) {
        log.writeLog('server.log', `Error finding all presentations: ${error.message}`)
        res.status(500).send
    }
}

exports.updatePresentation = async (req, res) => {
    try {
        const presentation = await Presentation.findById(req.params.id);
        if (!presentation) {
            return res.status(404).send();
        }

        Object.keys(req.body).forEach(key => presentation[key] = req.body[key]);
        await presentation.save();
        res.send(presentation);
    } catch (error) {
        log.writeLog('server.log', `Error updating presentation: ${error.message}`)
        res.status(400).send(error);
    }
};

exports.deletePresentation = async (req, res) => {
    try {
        const presentation = await Presentation.findByIdAndDelete(req.params.id);
        if (!presentation) {
            return res.status(404).send();
        }
        res.send(presentation);
    } catch (error) {
        log.writeLog('server.log', `Error deleting presentation: ${error.message}`)
        res.status(500).send(error);
    }
};
