const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const presentationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    presenter: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
    },
    summary: {
        type: String,
    },
    slides: [{
        title: String,
        content: String
    }],
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
});

module.exports = mongoose.model('Presentation', presentationSchema);
