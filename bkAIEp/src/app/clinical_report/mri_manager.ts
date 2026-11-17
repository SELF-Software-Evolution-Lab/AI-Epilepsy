import { v4 as unique } from 'uuid';
import { ftpUtility } from '@core/ftpUtility';
import AdmZip from 'adm-zip'
import fsPromises from 'fs/promises';
const fs = require('fs');
const path = require('path');


/**
 * Clase estática para el manejo de MRIs
 * Hasta el alcanze de la tesis
 * @author mreinaroca
 */
export class MRI_manager {
  private static readonly TEMPORAL_FILES_PATH: string = '/code/src/app/clinical_report/temp';

  /**
   * Trae del servidor FTP el archivo [filename] de la carpeta system_folder
   * @param filename, nombre del archivo a traer con la extensión (.zip)
   * @param filepath, ruta donde se almacena el archivo en el servidor FTP
   */
  public static async downloadMRIZip_fromFTP(filename, filepath) {
    const connection = unique();
    await ftpUtility.connect(connection)
    const folderTemporalName = filename.slice(0, -4);
    const localFolderDestination = `${MRI_manager.TEMPORAL_FILES_PATH}/${folderTemporalName}`;

    if (!fs.existsSync(localFolderDestination)) {
      fs.mkdirSync(localFolderDestination, { recursive: true });
    }

    const localFileDestination = `${localFolderDestination}/${filename}`;
    await ftpUtility.downloadTo(connection, localFileDestination, `${filepath}${filename}`);
    const zip = new AdmZip(localFileDestination);
    zip.extractAllTo(localFolderDestination, true);
  }

  /**
   * Busca dinámicamente el directorio del MRI, selecciona el corte .dcm del medio,
   * extrae sus píxeles usando importación dinámica y genera un PNG para pdfmake.
   * 
   * Se asume que ya se descargó el archivo con `downloadMRIZip_fromFTP`
   * 
   * @param filename nombre con la extensión de archivo
   * @returns Nodo de imagen compatible con pdfmake
   */
  public static async generate_MRI_image(filename: string): Promise<any> {
    const basePath = path.join(this.TEMPORAL_FILES_PATH, filename.slice(0, -4));

    const items = fs.readdirSync(basePath);
    const subdirs = items.filter(item => fs.statSync(path.join(basePath, item)).isDirectory());
    const targetDir = subdirs.length > 0 ? path.join(basePath, subdirs[0]) : basePath;

    const files = fs.readdirSync(targetDir);
    const dcmFiles = files.filter(f => f.toLowerCase().endsWith('.dcm'));

    if (dcmFiles.length === 0) {
      throw new Error(`No se encontraron archivos DICOM (.dcm) en ${targetDir}`);
    }

    dcmFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

    const middleIndex = Math.floor(dcmFiles.length / 2);
    const selectedDcm = dcmFiles[middleIndex];
    const dcmPath = path.join(targetDir, selectedDcm);
    const pngPath = dcmPath.replace('.dcm', '.png');

    const [daikonModule, rawJimpModule] = await Promise.all([
      import('daikon'),
      import('jimp')
    ]);

    const daikon = (daikonModule as any).default || daikonModule;
    let Jimp = (rawJimpModule as any).default || rawJimpModule;
    if (typeof Jimp !== 'function') {
      Jimp = Jimp.Jimp || Jimp.default || Jimp;
    }

    if (typeof Jimp !== 'function') {
      console.error("Estructura del módulo Jimp resuelto:", rawJimpModule);
      throw new Error("No se pudo resolver el constructor de Jimp. Verifica la versión de la librería.");
    }

    const fileBuffer = fs.readFileSync(dcmPath);
    const dataView = new DataView(fileBuffer.buffer, fileBuffer.byteOffset, fileBuffer.byteLength);

    const dicomImage = daikon.Series.parseImage(dataView);
    if (!dicomImage) {
      throw new Error(`El archivo DICOM no pudo ser parseado: ${selectedDcm}`);
    }
    if (!dicomImage.hasPixelData()) {
      throw new Error(`El archivo DICOM no contiene datos de imagen (matriz de píxeles vacía): ${selectedDcm}`);
    }

    const pixelData = dicomImage.getInterpretedData();
    const cols = dicomImage.getCols();
    const rows = dicomImage.getRows();

    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i] > max) max = pixelData[i];
      if (pixelData[i] < min) min = pixelData[i];
    }

    const buffer = Buffer.alloc(cols * rows * 4);
    let pixelIndex = 0;
    let bufferIndex = 0;

    for (let i = 0; i < cols * rows; i++) {
      const val = pixelData[pixelIndex++];
      const scaledVal = Math.floor(((val - min) / (max - min)) * 255);

      buffer[bufferIndex++] = scaledVal; 
      buffer[bufferIndex++] = scaledVal; 
      buffer[bufferIndex++] = scaledVal; 
      buffer[bufferIndex++] = 255;       
    }

    const pngImage = new Jimp({
      width: cols,
      height: rows,
      data: buffer
    });
    await pngImage.write(pngPath);

    return {
      image: pngPath,
      width: 350,
      alignment: 'center',
      margin: [0, 15, 0, 15]
    };
  }

  /**
   * Elimina recursivamente la carpeta temporal generada por la descarga de MRI.
   * @param filename nombre del archivo (incluida la extensión) para limpiar esos archivos temporales
   */
  public static async cleanTemporalFiles(filename: string) {
    const localFolderDestination = `${MRI_manager.TEMPORAL_FILES_PATH}/${filename.slice(0, -4)}`;
    try {
      await fsPromises.rm(localFolderDestination, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error al limpiar archivos temporales en ${localFolderDestination}:`, error);
    }
  }
}