const fs = require('fs');
exports.writeLog = (fichier, message) => {
    if(!fs.existsSync(fichier)) {
        fs.writeFileSync(fichier, '', "utf8");
        console.log('Log file created.')
    }
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(fichier, logMessage, (err) => {
        if(err) {
            console.log(`Unable to write to ${fichier}`, err);
        }
    });
}

exports.logRequest = (fichier, req, customMessage) => {
    const method = req.method;
    const url = req.originalUrl || req.url;
    const message = `Method: ${method}, URL: ${url}, Message: ${customMessage}`;
    this.writeLog(fichier, message);
}

exports.rotateLog = () => {
    const MAX_LOG_SIZE = 5 * 1024 * 1024;

    const stats = fs.statSync('request.log')
    if(stats.size >= MAX_LOG_SIZE){
        const unique = `request_${new Date().toISOString().replace(/:/g, '-')}.log`
        fs.renameSync('request.log', path.join(__dirname, unique));
        fs.writeFileSync('request.log', '', 'utf8');
    }
}
