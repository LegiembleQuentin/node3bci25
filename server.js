const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./config/logFunction');
require('dotenv').config();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const messageEmitter = require('./event');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use((req, res, next) => {
    log.rotateLog();
    log.logRequest('request.log', req, 'Received new request');
    messageEmitter.emit('message', req.url);
    next();
});

const articleRoutes = require('./routes/article.routes');
const presentationRoutes = require('./routes/presentation.routes');
const invoiceRoutes = require('./routes/invoice.routes');
app.use('/api', articleRoutes);
app.use('/api', presentationRoutes);
app.use(bodyParser.json());
app.use('/api', invoiceRoutes);

app.listen(7007, () => {
    log.writeLog('server.log', 'Server started on http://localhost:5000');
})

