import { patientService } from "@app/services/patient/patientService";

/**
 * Esta clase estática se encarga de la creación del reporte .pdf utilizando PDFmaker como dependencia.
 * Para más información sobre el uso de PDFmaker revisar https://pdfmake.github.io/docs/0.3/
 * @author mreinaroca
 */
const path = require('path');
const pdfmake = require('pdfmake');

export class ClinicalReport {  

  /**
   * Definición de las fuentes de letra que se pueden usar en la generación
   * de PDFs. Se dejan como atributo estático y constante para poder reusarlos en los 
   * diferentes métodos pertenecientes a esta clase.
   */
  private static readonly fonts = {
      Roboto: {
        normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
        bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
        italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, 'fonts', 'Roboto-MediumItalic.ttf'),
      }
  };

  /**
   * Esta función genera un .pdf para probar la funcionalidad de PDFmaker. También sirve para desarrollar con hot reload
   * el contenido del pdf (especialmente útil en desarrollo)
   * @return void
   */
  public static generate_test_PDF(){

    pdfmake.addFonts(ClinicalReport.fonts);
    // Contenido básico para probar la generación del PDF con datos dummy.
    const patient_data = { "id": 1, "first_name": "Pepito Andrés", "last_name": "Pérez González", "age": 20, "gender": "male", "blood_type": "A+", "email": "email@gmail.com", "emergency_contact_name": "Pedro González", "emergency_contact_phone": "123434", "document_id": "10000000" }
    const prediction_content = { "patient_id":1, "prediction_id": 43, "result":0, "eeg_data": { "File1": ",5,10,30,40", "File2": ",20,50" }, "mri_data":{"Lesion":"None"}, "arn_data":{}}

    /* Aquí se definen los elementos del documento */
    var docDefinition = {

      info: {
        language: 'es-es',
        creationDate: new Date(),
        modDate: new Date()
      },

      // 'watermark' es opcional
      watermark: { text: 'Documento no oficial', color: 'gray', opacity: 0.2 },

      content: [
        { text: "Reporte clínico", style: "header" },
        { text: "Diagnóstico de Epilepsia", style: "subheader" },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },

        /* Sección datos básicos del paciente */ 
        { text: "Datos básicos del paciente", style: "section_starter" },
        { columns: [

          /* Columna 1 */
          {
            stack: [
              { text: "Nombre del paciente: " + patient_data["first_name"] + " " + patient_data["last_name"] + ". Documento: " + patient_data["document_id"] },
              { text: "Edad: " + patient_data["age"] + ". Género: " + patient_data["blood_type"] + ". Email: " + patient_data["email"] },
              { text: "Contacto de emergencia: " + patient_data["emergency_contact_name"] + ". Teléfono: " + patient_data["emergency_contact_phone"] },
            ]
          },
          /* Columna 2*/
          {
            stack: [
              { text: "ID del paciente: " + prediction_content["patient_id"] },
              { text: "ID de la predicción: " + prediction_content["prediction_id"] },
              { text: "Resultado general de la predicción: " + prediction_content["result"] }
            ]
          }
        ], 
          columnGap: 10
        },


        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        /* Sección de EEG */
        { text: "Sección EEG", style: "section_starter" },
        { text: JSON.stringify(prediction_content["eeg_data"]) },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        /* Sección de MRI */
        { text: "Sección MRI", style: "section_starter" },
        { text: JSON.stringify(prediction_content["mri_data"]) },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        /* Sección de miARN */
        { text: "Sección microARN", style: "section_starter" },
        { text: JSON.stringify(prediction_content["arn_data"]) },
      ],

      footer: {
        content: function (currentPage: number, pageCount: number) { return currentPage.toString() + ' of ' + pageCount; }
      },

      styles: {
        "header": {
          fontSize: 22,
          bold: true,
        },
        "subheader": {
          fontSize: 12,
          bold: true,
          italics: true,
          margin: [0,0,0,0] //left, top, right, bottom
        },
        "section_starter":{
          fontSize: 14,
          bold: true,
          margin: [0,10,0,0] //left, top, right, bottom
        },
      },
      defaultStyle: {
        fontSize: 11,
      }
    };

    var pdf = pdfmake.createPdf(docDefinition);
    return pdf.write(path.join(__dirname, 'PDF_Prueba.pdf'));
  }


  /**
   * Genera el reporte clínico .pdf y lo guarda en la tabla 'prediction' de la base de datos
   * @param prediction_content: el contenido de la predicción del modelo de ML
   * @returns Void
   */
  public static async generate_clinical_report(prediction_content: Record<string, any>) {

    if (!prediction_content.hasOwnProperty("eeg_data")) { prediction_content["eeg_data"] = "No se adjuntaron datos de EEG" }
    if (!prediction_content.hasOwnProperty("mri_data")) { prediction_content["mri_data"] = "No se adjuntaron datos de MRI" }
    if (!prediction_content.hasOwnProperty("arn_data")) { prediction_content["arn_data"] = "No se adjuntaron datos de miARN" }

    let db_response = await patientService.get({ id: prediction_content["patient_id"] })
    let patient_data = db_response["patient"]

    pdfmake.addFonts(ClinicalReport.fonts);

    /* Aquí se definen los elementos del documento */
    var docDefinition = {

      // 'info' es opcional
      info: {
        language: 'es-es',
        creationDate: new Date(),
        modDate: new Date()
      },
      // 'watermark' es opcional
      watermark: { text: 'Documento no oficial', color: 'gray', opacity: 0.2 },

      content: [
        { text: "Reporte clínico", style: "header" },
        { text: "Diagnóstico de Epilepsia", style: "subheader" },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },

        /* Sección datos básicos del paciente */ 
        { text: "Datos básicos del paciente", style: "section_starter" },
        { columns: [
          /* Columna 1 */
          {
            stack: [
              { text: "Nombre del paciente: " + patient_data["first_name"] + " " + patient_data["last_name"] + ". Documento: " + patient_data["document_id"] },
              { text: "Edad: " + patient_data["age"] + ". Género: " + patient_data["blood_type"] + ". Email: " + patient_data["email"] },
              { text: "Contacto de emergencia: " + patient_data["emergency_contact_name"] + ". Teléfono: " + patient_data["emergency_contact_phone"] },
            ]
          },
          /* Columna 2*/
          {
            stack: [
              { text: "ID del paciente: " + prediction_content["patient_id"] },
              { text: "ID de la predicción: " + prediction_content["prediction_id"] },
              { text: "Resultado general de la predicción: " + prediction_content["result"] }
            ]
          }
        ], 
          columnGap: 10 
        },


        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        
        /* Sección de EEG */
        { text: "Sección EEG", style: "section_starter" },
        { text: JSON.stringify(prediction_content["eeg_data"]) },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        
        /* Sección de MRI */
        { text: "Sección MRI", style: "section_starter" },
        { text: JSON.stringify(prediction_content["mri_data"]) },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
        
        /* Sección de miARN */
        { text: "Sección microARN", style: "section_starter" },
        {  
          table: {
            headerRows: 1,
            widths: ['*','*','*','*'],
            body: ClinicalReport.generateRNATableRows(prediction_content["arn_data"])
          },
          layout: 'lightHorizontalLines',
          margin: [15,10,15,10] // izquierda, arriba, derecha, abajo
        }
      ],

      styles: {
        "header": {
          fontSize: 22,
          bold: true,
        },
        "subheader": {
          fontSize: 12,
          bold: true,
          italics: true,
          margin: [0,0,0,0] // izquierda, arriba, derecha, abajo
        },
        "section_starter":{
          fontSize: 14,
          bold: true,
          margin: [0,10,0,0] // izquierda, arriba, derecha, abajo
        },
        "tableHeader": {
          fontSize: 12,
          bold:true
        },
        "tableContent":{
          fontSize: 11,
        }
      },
      defaultStyle: {
        fontSize: 11,
      }
    };

    pdfmake.addFonts(ClinicalReport.fonts);
    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();
    return buffer;
  }

  /**
   * Este método helper crea la estructura de la tabla de ARN en el formato de 
   * pdfmake para insertar en el documento
   * @param message_arn_data, el mensaje enviado sobre la predicción de los datos de miARN
   */
  private static generateRNATableRows(message_arn_data){
    const headerRow = [
      { text: 'ARN ID',          style: 'tableHeader' },
      { text: 'Conteo',          style: 'tableHeader' },
      { text: 'Límite Superior', style: 'tableHeader' },
      { text: 'Límite Inferior', style: 'tableHeader' },
    ];
    
    const dynamicRows = Object.entries(message_arn_data).map(([rnaID, stats]) => [
      { text: rnaID,             style: 'tableContent'},
      { text: stats['count'],    style: 'tableContent'},
      { text: stats['lim_inf'],  style: 'tableContent'},
      { text: stats['lim_sup'],  style: 'tableContent'}
    ])
    return [headerRow, ...dynamicRows];
  }
}

