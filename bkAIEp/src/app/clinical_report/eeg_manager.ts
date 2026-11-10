import { v4 as unique } from 'uuid';
import { ftpUtility } from '@core/ftpUtility';
import path from 'path';
import AdmZip from 'adm-zip'
const fs = require('fs');

/**
 * Clase estática para el manejo de EEGs
 * Estos se guardan en formato .edf y se utiliza la dependencia 'edfcore' para procesar estos archivos
 * Para más información sobre la dependencia 'edfcore' revisar https://edfcore.vercel.app/docs/quick-start
 * @author mreinaroca
 */
export class EEG_manager {

  // Where files from FTP server will be downloaded temporarily 
  private static readonly TEMPORAL_FILES_PATH: string = '/code/src/app/clinical_report/temp';

  /**
   * Carga los datos desde el tiempo inicial hasta el tiempo final de un archivo EDF local para el 
   * procesamiento de EEGs. Si el archivo solo se tiene en el servidor FTP, traer primero el archivo con
   * la función de abajo downloadEEG_fromFTP
   * 
   * @param startSeconds, tiempo inicial 
   * @param stopSeconds, tiempo final
   * @returns {Record<string, number[]>} diccionario con los datos del EEG desde startSeconds hasta stopSeconds 
   */
  public static async loadEDF_file(filename, startSeconds, stopSeconds) {
    // Caso inviable
    if (startSeconds >= stopSeconds) {throw new Error("El tiempo de finalización es menor que el tiempo de inicio")}

    // Importación de la depencia de manera dinámica
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const { openEdf, readWindow, toPhysical } = await dynamicImport('edfcore');
    const { fileSource } = await dynamicImport('edfcore/node');

    const edfPath = path.join(__dirname, `temp/${filename.slice(0,-4)}/${filename}`);
    const source = await fileSource(edfPath);

    try {
      const recording = await openEdf(source);
      const { header } = recording;

      const fileDate = header.startTime?.headerDate;

      //console.log(`=== CABECERA EXTRAIDA: ${filename}.edf ===`);
      //console.dir(header, {depth: null, colors: true})

      const selectedSignals = header.signals.filter((signal: any) => signal.label !== 'EDF Annotations');

      const signalsInfo = header.signals.map((signal: any, index: number) => ({
        label: signal.label,
        sampleRateHz: signal.samplesPerRecord / header.recordDurationSeconds,
      }))

      const signalIndices = selectedSignals.map((s: any) => s.index);

      const chunks = await readWindow(recording, {
        startSeconds: startSeconds,
        durationSeconds: stopSeconds - startSeconds,
        signalIndices: signalIndices,
      });

      const chunk = chunks[0];
      const chartData: Record<string, number[]> = {};
      
      if (chunk !== undefined) {
        selectedSignals.forEach((signal: any, index: number) => {
          const microvolts = toPhysical(signal, chunk.signals[index]!.digital);
          chartData[signal.label] = Array.from(microvolts);
        });
        return {
          chartData,
          fileDate,
          signalsInfo,
        };
      }
      
    } finally {
      await source.close?.();
    }
  }
  



  /**
   * Trae del servidor FTP el archivo [filename] de la carpeta system_folder
   * @param filename, nombre del archivo a traer sin la extensión (.zip)
   */
  public static async downloadEEG_fromFTP(filename, filepath){
    const connection = unique();
    await ftpUtility.connect(connection)
    const folderTemporalName = filename.slice(0,-4);
    const localFolderDestination = `${EEG_manager.TEMPORAL_FILES_PATH}/${folderTemporalName}`;

    if (!fs.existsSync(localFolderDestination)) {
        fs.mkdirSync(localFolderDestination, { recursive: true });
    }

    const localFileDestination = `${localFolderDestination}/${filename}`;
    await ftpUtility.downloadTo(connection, localFileDestination,`${filepath}${filename}`);
  }

  /**
   * Función para eliminar la carpeta temporal y su contenido.
   * @param filename 
   */
  public static async clean_temporal_files(filename){
    await fs.promises.rm(`${EEG_manager.TEMPORAL_FILES_PATH}/${filename.slice(0,-4)}`, { recursive: true, force: true });
  }
}