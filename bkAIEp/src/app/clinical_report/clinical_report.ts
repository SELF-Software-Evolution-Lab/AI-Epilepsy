import { patientService } from "@app/services/patient/patientService";
import { EEG_manager } from './eeg_manager';
import { predictionService } from "@app/services/prediction/predictionService";

const path = require('path');
const pdfmake = require('pdfmake');

/**
 * Esta clase estática se encarga de la creación del reporte .pdf utilizando PDFmaker como dependencia.
 * Para más información sobre el uso de PDFmaker revisar https://pdfmake.github.io/docs/0.3/
 * 
 * Se recomienda iniciar a leer la clase por el método `create_clinical_report()`  
 * @author mreinaroca
 */
export class ClinicalReport {
  /**
   * Definición de las fuentes de letra que se pueden usar en la generación de PDFs. 
   * Se dejan como atributo estático y constante para poder reusarlos en los diferentes métodos
   * pertenecientes a esta clase. Se usa <font> y <fontMedium> para incorporar las variaciones 'Medium'
   * de las diferentes fuentes. Usar exactamente el patrón <font> y <fontMedium> al incorporar nuevas fuentes.
   */
  private static readonly selectedFont = "Inter";
  private static readonly fonts = {
    Roboto: {
      normal: path.join(__dirname, 'fonts', 'Roboto-Regular.ttf'),
      bold: path.join(__dirname, 'fonts', 'Roboto-Bold.ttf'),
      italics: path.join(__dirname, 'fonts', 'Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, 'fonts', 'Roboto-BoldItalic.ttf'),
    },
    RobotoMedium: {
      normal: path.join(__dirname, "fonts", "Roboto-Medium.ttf"),
      bold: path.join(__dirname, "fonts", "Roboto-Medium.ttf"),
      italics: path.join(__dirname, "fonts", "Roboto-MediumItalic.ttf"),
      bolditalics: path.join(__dirname, "fonts", "Roboto-MediumItalic.ttf")
    },
    Lora: {
      normal: path.join(__dirname, "fonts", "Lora-Regular.ttf"),
      bold: path.join(__dirname, "fonts", "Lora-Bold.ttf"),
      italics: path.join(__dirname, "fonts", "Lora-Italic.ttf"),
      bolditalics: path.join(__dirname, "fonts", "Lora-BoldItalic.ttf")
    },
    LoraMedium: {
      normal: path.join(__dirname, "fonts", "Lora-Medium.ttf"),
      bold: path.join(__dirname, "fonts", "Lora-Medium.ttf"),
      italics: path.join(__dirname, "fonts", "Lora-MediumItalic.ttf"),
      bolditalics: path.join(__dirname, "fonts", "Lora-MediumItalic.ttf")
    },
    Inter: {
      normal: path.join(__dirname, "fonts", "Inter-Regular.ttf"),
      bold: path.join(__dirname, "fonts", "Inter-Bold.ttf"),
      italics: path.join(__dirname, "fonts", "Inter-Italic.ttf"),
      bolditalics: path.join(__dirname, "fonts", "Inter-BoldItalic.ttf")
    },
    InterMedium: {
      normal: path.join(__dirname, "fonts", "Inter-Medium.ttf"),
      bold: path.join(__dirname, "fonts", "Inter-Medium.ttf"),
      italics: path.join(__dirname, "fonts", "Inter-MediumItalic.ttf"),
      bolditalics: path.join(__dirname, "fonts", "Inter-MediumItalic.ttf")
    }
  };

  // Se ejecuta solo una única vez cuando Node lee esta clase, útil para aumentar el desempeño
  static {
    pdfmake.addFonts(ClinicalReport.fonts);
  }

  /**
   * Crea el reporte clínico en formato .pdf y lo retorna en forma de buffer para poder ser guardado
   * como BLOB en la base de datos.
   * 
   * @param {Record<string, any>} prediction_content, el contenido de la predicción del modelo de ML
   * @returns {Buffer} el .pdf en formato de buffer para almacenar en la base de datos
   */

  public static async create_clinical_report(prediction_content: Record<string, any>) {

    let db_patient_response = await patientService.get({ id: prediction_content["patient_id"] })
    let patient_data = db_patient_response["patient"]

    let db_prediction_response = await predictionService.get({id: prediction_content["prediction_id"]})
    let prediction_files_data = JSON.parse(db_prediction_response["prediction"]["prediction_data"])

    const patient_content = ClinicalReport.generate_patient_data(patient_data, prediction_content)
    const miARN_content = ClinicalReport.generate_miARN_content(prediction_content)
    const EEG_content = await ClinicalReport.generate_EEG_content(prediction_content, prediction_files_data);
    const MRI_content = await ClinicalReport.generate_MRI_content(prediction_content, prediction_files_data)

    var docDefinition = ClinicalReport.generate_doc_definition(ClinicalReport.selectedFont, patient_content, miARN_content, EEG_content, MRI_content);

    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();
    return buffer;
  }


  /**
   * Genera la definición del documento (orden de las secciones, definición de estilos incluyendo la fuente, etc.)
   * necesario para la generación del documento con pdfmake. Se separa esta responsabilidad por fuera de 'create_clinical_report()'
   * para utilizar esta misma definición bajo escenarios de prueba y mantenibilidad.
   * 
   * @param selectedFont, string con el nombre exacto de la fuente seleccionada. Si no se encuentra la fuente, se usa Roboto por defecto.
   * @param patient_content, contenido relacionado a la sección del paciente
   * @param miARN_content, contenido relacionado a la sección del miARN
   * @param EEG_content, contenido relacioando a la sección del EEG
   * @param MRI_content, contenido relacionado a la sección del MRI
   * 
   * @returns docDefinition, bajo la librería de pdfmake
   */

  private static generate_doc_definition(selectedFont, patient_content, miARN_content, EEG_content, MRI_content) {

    const availableFonts = Object.keys(ClinicalReport.fonts);
    const safeFont = availableFonts.includes(selectedFont) ? selectedFont : "Roboto";
    const defaultTextSize = 11;


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
        ClinicalReport.draw_horizontalLine(),

        patient_content,
        ClinicalReport.draw_horizontalLine(),

        /* Sección de EEG */
        { text: "Sección EEG", style: "sectionStarter" },
        EEG_content,
        ClinicalReport.draw_horizontalLine(),

        /* Sección de miARN */
        { text: "Sección microARN", style: "sectionStarter" },
        miARN_content,
        ClinicalReport.draw_horizontalLine(),

        /* Sección de MRI */
        { text: "Sección MRI", style: "sectionStarter" },
        MRI_content,
        ClinicalReport.draw_horizontalLine(),
      ],

      defaultStyle: {
        font: safeFont,
        fontSize: defaultTextSize,
      },

      styles: {
        "header": {
          font: safeFont,
          fontSize: 22,
          bold: true,
          alignment: 'center',
        },
        "subheader": {
          font: safeFont + "Medium",
          fontSize: 12,
          bold: true,
          italics: true,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        "sectionStarter": {
          font: safeFont,
          fontSize: 13,
          bold: true,
          margin: [0, 0, 0, 0]
        },
        "keyText": {
          font: safeFont + "Medium",
          fontSize: defaultTextSize,
        },
        "tableHeader": {
          font: safeFont + "Medium",
          fontSize: 10,
          bold: true
        },
        "tableContent": {
          font: safeFont,
          fontSize: 9,
        }
      },
    };
    return docDefinition
  }


  /**
   * Genera un componente con dos columnas con la información básica del paciente y resultado general de la predicción
   * @param patient_data: información básica del paciente
   * @param prediction_content: mensaje del modelo de predicción
   * @returns el componente pdfmake con dos columnas
   */
  private static generate_patient_data(patient_data, prediction_content) {

    if (patient_data["gender"] == "male") { patient_data["gender"] = "Masculino" }
    else if (patient_data["gender"] == "female") { patient_data["gender"] = "Femenino" }

    return {
      stack: [
        { text: "Datos básicos del paciente", style: "sectionStarter" },
        {
          margin: [10, 5, 5, 5],
          columns: [
            { /* Columna 1 */
              width: "50%",
              stack: [
                { text: [{ text: "Nombre del paciente: ", style: "keyText" }, `${patient_data["first_name"]} ${patient_data["last_name"]}`] },
                { text: [{ text: "Email: ", style: "keyText" }, `${patient_data["email"]}`] },
                { text: [{ text: "Documento: ", style: "keyText" }, `${patient_data["document_id"]}`] },
                { text: [{ text: "Género: ", style: "keyText" }, `${patient_data["gender"]}`] },
                { text: [{ text: "Edad: ", style: "keyText" }, `${patient_data["age"]}`] },
                { text: [{ text: "Rh: ", style: "keyText" }, `${patient_data["blood_type"]}`] },
              ]
            },
            {/* Columna 2*/
              width: "50%",
              stack: [
                { text: [{ text: "Contacto de emergencia: ", style: "keyText" }, `${patient_data["emergency_contact_name"]}`] },
                { text: [{ text: "Teléfono: ", style: "keyText" }, `${patient_data["emergency_contact_phone"]}`] },
                { text: [{ text: "ID del paciente: ", style: "keyText" }, `${prediction_content["patient_id"]}`] },
                { text: [{ text: "ID de la predicción: ", style: "keyText" }, `${prediction_content["prediction_id"]}`] },
                { text: [{ text: "Resultado general de la predicción: ", style: "keyText" }, `${prediction_content["result"]}`] }
              ]
            }
          ],
          columnGap: 10
        }
      ]
    }
  }


  /**
   * Este método genera el contenido asociado a los miARN, ya sea desplegar el mensaje genérico o 
   * la estructura de la tabla de ARN en el formato de pdfmake para insertar en el documento
   * 
   * @param prediction_content, el mensaje enviado desde el modelo de predicción 
   * @returns tabla en formato pdfmake || si no hay mensaje sobre ARN se retorna un mensaje genérico
   */
  private static generate_miARN_content(prediction_content) {

    if (!prediction_content.hasOwnProperty("arn_data")) { return { text: "No se adjuntaron datos de miARN." } }
    else if (prediction_content["arn_data"] == "") { return { text: "El mensaje de predicción de miARN está vacío." } }
    else {
      const message_arn_data = prediction_content["arn_data"]
      const headerRow = [
        { text: 'miARN ID', style: 'tableHeader' },
        { text: 'Conteo', style: 'tableHeader' },
        { text: 'Límite inferior', style: 'tableHeader' },
        { text: 'Límite superior', style: 'tableHeader' },
      ];

      const dynamicRows = Object.entries(message_arn_data).map(([rnaID, stats]) => [
        { text: rnaID, style: 'tableContent' },
        { text: stats['count'], style: 'tableContent' },
        { text: stats['lim_inf'], style: 'tableContent' },
        { text: stats['lim_sup'], style: 'tableContent' }
      ])

      return {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto'],
              body: [headerRow, ...dynamicRows]
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === 1) ? 1.0 : 0.5;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
              hLineColor: function (i, node) {
                if (i === 0 || i === 1) { return "#000" }
                return "#aaa";
              },
              paddingLeft: function (i, node) { return 8; },
              paddingRight: function (i, node) { return 8; },
              paddingTop: function (i, node) { return 4; },
              paddingBottom: function (i, node) { return 4; }
            },
            margin: [15, 10, 15, 10]
          },
          { width: '*', text: '' },
        ]
      }
    }
  }



  /**
   * Este método genera el contenido asociado a los datos de EEG, ya sea el mensaje genérico o el conjunto
   * de gráficas donde se puede observar la crisis epiléptica detectada por el modelo de ML
   * 
   * @param prediction_content, el mensaje enviado desde el modelo de predicción 
   * @returns el contenido relacionado al EEG || mensaje genérico si no se adjuntaron datos
   */
  private static async generate_EEG_content(prediction_content, prediction_files_data) { 
    if (!prediction_content.hasOwnProperty("eeg_data")) { return { text: "No se adjuntaron datos de EEG" } }
    else if (prediction_content["eeg_data"] === "") { return { text: "El mensaje de predicción de EEG está vacío" } }
    else {

      let db_filename = prediction_files_data["eegfile"]
      let db_filepath = prediction_files_data["eegpath"]

      const maxEEGcharts_per_file = 5;
      const main_stack = [];

      for (const [filename, range] of Object.entries(prediction_content["eeg_data"])) {
        await EEG_manager.downloadEEG_fromFTP(db_filename, db_filepath);

        const file_svg_stack = [];
        file_svg_stack.push({
          text: `Gráficas del archivo: ${filename}`,
          style: "keyText",
          margin: [0, 10, 0, 0]
        });

        const list_ranges = (range as string).split(',');
        let charts_count = 0;

        for (let i = 0; i < list_ranges.length; i += 2) {

          if (charts_count >= maxEEGcharts_per_file) { break; }

          const start = Number(list_ranges[i])
          const end = Number(list_ranges[i + 1])
          const {chartData, fileDate, signalsInfo } = await EEG_manager.loadEDF_file(db_filename, start, end);

          if (!chartData) { throw new Error("No se pudieron extraer los datos del archivo EDF"); }
          if(i===0){
            const formattedDate = fileDate ?`Fecha del estudio: ${fileDate.year}-${String(fileDate.month).padStart(2,'0')}-${String(fileDate.day).padStart(2,'0')}`: "No hay fecha en el archivo .edf";
            file_svg_stack.push({text: formattedDate})
          }

          const sampleRate = (signalsInfo && signalsInfo.length > 0) 
            ? signalsInfo[0].sampleRateHz : 256;

          const svg_chart = await ClinicalReport.draw_EEG_chart(chartData, sampleRate, start);
          file_svg_stack.push(svg_chart)
          charts_count++;
        }

        EEG_manager.clean_temporal_files(db_filename)
        main_stack.push({ stack: file_svg_stack })
      }
      return {
        stack: main_stack,
        margin: [10, 0, 10, 0]
      };
    }
  }



  private static async generate_MRI_content(prediction_content, prediction_files_data) {
    if (!prediction_content.hasOwnProperty("mri_data")) { return { text: "No se adjuntaron datos de MRI" } }
    else if (prediction_content["mri_data"] === "") { return { text: "El mensaje de predicción de MRI está vacío" } }
    else {
      let filename = prediction_files_data["mrifile"]
      let filepath = prediction_files_data["mripath"]
      return { text: "Contenido en progreso\n" + `filename: ${filename}, filepath: ${filepath}`}
    }
  }

  /**
   * Dibuja la gráfica de EEG correspondiente a los datos entregados
   * @param chartData: datos del EDF para generar la gráfica
   * @returns svg: con el gráfico
   */
  private static async draw_EEG_chart(chartData: Record<string, number[]>, sampleRate: number, start_time) {

    const echarts = require('echarts');
    const sampleCount = Object.values(chartData)[0].length;
    const labels = Array.from({ length: sampleCount }, (_, i) => (start_time + (i / sampleRate)).toString());

    const chart = echarts.init(null, null, {
      renderer: 'svg',
      ssr: true,
      width: 800,
      height: 280
    });

    const series = Object.keys(chartData).map((label) => ({
      name: label,
      type: 'line',
      data: chartData[label],
      showSymbol: false,
      lineStyle: { width: 1.5 }
    }));

    chart.setOption({
      animation: false,
      backgroundColor: '#ffffff',
      color: [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', 
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#aee693',
        '#3d59ab', '#75b359', '#e0ae36', '#d44c4c', '#55a7c7', 
        '#268557', '#e36632', '#7d4399', '#c95cb0', '#728de0', 
      ],
      grid: {
        left: 50,
        right: 140,
        top: 20,
        bottom: 40
      },
      xAxis: {
        type: 'category',
        data: labels,
        name: "Segundos",
        nameLocation: "middle",
        nameGap: 25,
        axisLabel: {
          interval: function (index: number) {
            return index % sampleRate === 0 || index === sampleCount - 1;
          },
          formatter: function (value: string) {
            return Math.round(parseFloat(value)).toString();
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Microvoltios (µV)'
      },
      series: series,
      legend: {
        show: true,
        right: 0,
        top: 'middle',
        orient: 'vertical',
        itemGap: 4,
        itemWidth: 15,
        textStyle: {
          fontSize: 9
        }
      }
    });

    const svgString = chart.renderToSVGString();

    return {
      svg: svgString,
      width: 500,
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }

  /**
   * Dibuja una línea horizontal en el documento. Abstracción útil para la creación del documento
   * @returns línea horizontal en formato pdfmake
   */
  private static draw_horizontalLine() {
    return {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
      margin: [0, 8, 0, 8]
    }
  }
}