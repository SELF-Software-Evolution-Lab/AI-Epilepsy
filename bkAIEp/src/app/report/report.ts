/**
 * Este archivo se encarga de la creación del reporte .pdf utilizando PDFmaker como
 * dependencia.
 * 
 * @author mreinaroca
 */

const path = require('path');
const pdfmake = require('pdfmake');

export default function generarPDFPrueba() {
    var fonts = {
        Roboto: {
            normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
            bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
            italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, 'fonts', 'Roboto-MediumItalic.ttf'),
        }
    };

    pdfmake.addFonts(fonts);


    /* Aquí se definen los elementos del documento */
    var docDefinition = {
        content: [
            { text: "Este es el primer .pdf", fontsize: 16, bold: true }
        ]
    };

    var options = {};

    var pdf = pdfmake.createPdf(docDefinition);
    return pdf.write(path.join(__dirname, 'PDF_Prueba.pdf'));
}

