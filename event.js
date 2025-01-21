const EventEmitter = require('events');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const messageEmitter = new EventEmitter();

messageEmitter.on('message', (message) => {
    console.log('Message received:', message);
})

messageEmitter.on('generate-invoice', (data) => {
    const doc = new PDFDocument;
    let filename = `Invoice_${Date.now()}.pdf`;
    filename = encodeURIComponent(filename);
    doc.pipe(fs.createWriteStream(filename));

    doc.fontSize(25)
        .text('Invoice', {
            align: 'center'
        });

    doc.fontSize(12)
        .moveDown()
        .text(`Date: ${new Date().toLocaleDateString()}`, {
            align: 'right'
        });

    // Iterate over the request body assuming it's an order object
    Object.keys(data).forEach(key => {
        doc.moveDown()
            .text(`${key}: ${data[key]}`);
    });

    doc.end();
    console.log(`Invoice generated: ${filename}`);
});

module.exports = messageEmitter;
