/**
 * Este archivo se encarga de la creación del reporte .pdf utilizando PDFmaker como
 *  dependencia.
 * 
 * Para más información sobre el uso de PDFmaker revisar https://pdfmake.github.io/docs/0.3/
 * @author mreinaroca
 */

const path = require('path');
const pdfmake = require('pdfmake');

export class ClinicalReport {
  /**
   * Esta función genera un .pdf para probar la funcionalidad de PDFmaker. También sirve para desarrollar con hot reload
   * el contenido del pdf (especialmente útil en desarrollo)
   * @author mreinaroca
   */
  public static generate_test_PDF() {
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
      
      // 'info' es opcional
      info: { 
        language: 'es-es',
        creationDate: ''
      },

      // 'watermark' es opcional
      watermark: { text: 'Documento no oficial', color: 'gray', opacity: 0.2}, 

      content: [
        { text: "Reporte clínico", style:"header"},
        { text: "Diagnóstico de Epilepsia", style:"subheader"},
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
          ]
        },
        { 
          layout: 'lightHorizontalLines',
          table: {
          headerRows:1,
          widths: ['auto','auto','auto'],
          body: [
            [ 'First', 'Second', 'Third' ],
            [ 'Value1','Value2', 'Value3']
          ]}
        }
      ],

      styles: {
        "header": {
          fontSize: 22,
          bold: true,
        },
        "subheader": {
          fontSize: 16,
          bold: true
        }
      }
    };
    
    var pdf = pdfmake.createPdf(docDefinition);
    return pdf.write(path.join(__dirname, 'PDF_Prueba.pdf'));
  }
  public static generate_clinical_report(prediction_content:Record<string,any>){
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
      
      // 'info' es opcional
      info: { 
        language: 'es-es',
        creationDate: ''
      },

      // 'watermark' es opcional
      watermark: { text: 'Documento no oficial', color: 'gray', opacity: 0.2}, 

      content: [
        { text: "Reporte clínico", style:"header"},
        { text: "Diagnóstico de Epilepsia", style:"subheader"},
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
          ]
        },
        { text: JSON.stringify(prediction_content)}

      ],

      styles: {
        "header": {
          fontSize: 22,
          bold: true,
        },
        "subheader": {
          fontSize: 16,
          bold: true
        }
      }
    };
    
    var pdf = pdfmake.createPdf(docDefinition);
    return pdf.write(path.join(__dirname, 'PDF_Prueba.pdf'));
  }
}

