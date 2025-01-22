const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const log = require('./config/logFunction');
require('dotenv').config();
app.use(bodyParser.json());
const mongoose = require('mongoose');
const messageEmitter = require('./event');
const cors = require('cors');
const compression = require('compression');
const logger = require('./config/logger');
const nodemailer = require('nodemailer');
const helmet = require('helmet');

//options de protection par defaut:
//CLICKJACKING
//FUITE DE DONNEE
//INJECTION DE SCRIPT
//TELECHARGEMENT AUTOMATIQUE DE FICHIER DANGEREUX
//PROTECTION XSS
//PROTECTION DE MIME TYPE
app.use(helmet());

app.use(cors({
    origin: 'http://bci25.portfolio-etudiant-rouen.com',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression({
        threshold: 1024,
        level: 9,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return !req.path.match(/\.(jpg|jpeg|png|gif|pdf|mp4)$/i);
        }
    }
));

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Error connecting to MongoDB:', err));

app.use((req, res, next) => {
    log.rotateLog();
    log.logRequest('request.log', req, 'Received new request');
    logger.info('Received new request', {url: req.url, method: req.method, ip: req.ip});
    messageEmitter.emit('message', req.url);
    next();
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls : {
        rejectUnauthorized: false

    }
});

logger.on('crit', (error) => {
    logger.crit('Error critique: ', error);
    sendMail(error);
});

async function sendMail(errorMsg) {
    try {
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'ALERTE CRITIQUE',
            text: `Une erreur critique est survenue: ${errorMsg}`,
            html: `<h2>Une erreur critique est survenue</h2><p>${errorMsg}</p>`
        });
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    }catch (error) {
        console.log('erreur dans la creation du mail')
    }
}

const articleRoutes = require('./routes/article.routes');
const presentationRoutes = require('./routes/presentation.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const cryptoRoutes = require('./routes/crypto.routes');
app.use('/api', articleRoutes);
app.use('/api', presentationRoutes);
app.use(bodyParser.json());
app.use('/api', invoiceRoutes);
app.use('/api', cryptoRoutes);

app.listen(7007, () => {
    log.writeLog('server.log', 'Server started on http://localhost:5000');
})

