import randomstring from 'randomstring'

import { responseUtility } from "@core/responseUtility"
import { Event, Exam } from '@app/models'
import { Op } from "sequelize"
import { finderService } from "@app/services/finder/finderService"
import moment from 'moment'
import {ftpUtility} from "@core/ftpUtility";
import fs from "node:fs";
import {ExamModel} from "@app/models/examModel";
import {v4 as unique} from 'uuid'

import zlib from 'node:zlib'
import { pipeline } from "node:stream";
import AdmZip from "adm-zip";


const PATH_BASE = '/home/user'
const PATH_OUT = '/home/user/exams-test'

class ExamService {

  constructor () {}

  /**
  * Inserts or updates an exam record based on the presence of 'id' in _params.
  * @param _params - Exam parameters.
  * @returns Promise<{exam: Exam}> - Promise containing the exam object.
  */
  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        // Update existing exam
        const exists = await Exam.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('exam.not_found')
        const _exam = await Exam.update(_params, { where: { id: _params.id } })
        const exam = await Exam.findOne({ where: { id: _params.id } })
        return responseUtility.success({exam: exam})
      } else {
        // Insert new exam
        if(_params.type === 'mri' || _params.type === 'arn'   || _params.type === 'eeg'){
          // Validate required fields for specific exam types
          if(!_params.source) return responseUtility.error('exam.insert_update.no_source')
          if(!_params.detail) return responseUtility.error('exam.insert_update.no_detail')
          if(!_params.file) return responseUtility.error('exam.insert_update.no_file')
          if(!_params.type) return responseUtility.error('exam.insert_update.no_type')
          if(!_params.patient_id) return responseUtility.error('exam.insert_update.no_patient_id')

          // Convert exam type to lowercase
          _params.type = _params.type.toLowerCase()

          // Generate a random string for the file name
          const _r = randomstring.generate(7)
          const _n = _params.file.split('.')
          const new_name = `${_r}.${_n[_n.length -1]}`
          const path = `${PATH_OUT}/${_params.patient_id}/${_params.type}/`

          // Update file path and name in the exam parameters
          _params.path = `${path}`
          _params.file = new_name

          // Transfer the file to the specified path
          const transfer = await finderService.transfer({from: _params.source, to: path, file: new_name})
          if(transfer.status === 'error') return transfer
        }

        // Create an event for the new exam
        const __event =   {
          detail: moment.utc().toISOString(),
          person: "Zadiaz",
          type: `Examen ${_params.type}`,
        }

        // Save the event to the database
        const _event = await Event.create(__event)
        const event = _event.toJSON()

        // Create the exam record
        const _exam = await Exam.create(_params)
        const exam = _exam.toJSON()
        
        return responseUtility.success({exam, event})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.insert_update.fail_action')
    }
  }

  /**
  * Retrieves a list of exams based on the provided parameters.
  * @param _params - Query parameters for filtering exams.
  * @returns Promise<{exams: Exam[]}> - Promise containing the list of exams.
  */
  public async list (_params: any) {
    try{

      const { page, number } = _params
      // Construct the query based on provided parameters
      const query:any = {
        where: {},
      }

      if(_params.patient_id){
        query.where['patient_id'] = {
          [Op.eq]: _params.patient_id
        }
      }

      if(_params.type){
        query.where['type'] = {
          [Op.eq]: _params.type.toUpperCase()
        }
      }

      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }

      const exams = await Exam.findAll(query)
      return responseUtility.success({exams})
    } catch (error) {
      console.log('error', error)
    }
  }

  /**
  * Deletes an exam record based on the provided parameters.
  * @param _params - Parameters for identifying the exam to be deleted.
  * @returns Promise<{exam: Exam}> - Promise containing the deleted exam object.
  */
  public async delete (_params: any) {
    try{
      // Check if the exam exists
      const exists = await Exam.findOne({ where: { id: _params.id } })
      // Delete the exam record
      if(!exists) return responseUtility.error('exam.not_found')
      await Exam.destroy({ where: { id: _params.id } })
      // Return the deleted exam
      return responseUtility.success({exam: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.list.fail_action')
    }
  }

  /**
  * Retrieves details of a specific exam based on the provided parameters.
  * @param _params - Parameters for identifying the exam to be retrieved.
  * @returns Promise<{exam: Exam}> - Promise containing the retrieved exam object.
  */
  public async get (_params: any) {
    try{
      const exam = await Exam.findOne({ where: { id: _params.id } })
      if(!exam) return responseUtility.error('exam.not_found')
      return responseUtility.success({exam})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.get.fail_action')
    }
  }

  /**
  * A placeholder method for testing purposes.
  * @param _params - Parameters for the test.
  */
  public async test (_params: any) {
    try{

    } catch (error) {
      console.log('error', error)
    }
  }
    /**
     * Will check if the MRI test exists in cache folder. If so, will return an array of Series folders names 200 OK response.
     * Otherwise, it will retrieve and unzip the exam file, and return the list once done
     * @param _params
     */
    async requestMRITest(_params: any) {
        try {
            const exam = await ExamModel.findOne({where: {id: _params.id}})
            if (!exam) return responseUtility.error('exam.not_found')

            const patientID = exam.patient_id
            const examID = exam.id
			const fileName = exam.file;
            const filePath = exam.path;
            const tempPath = `temp/mri/${patientID}/${examID}`;

            const directory_exists = fs.existsSync(tempPath)
            if (directory_exists) {
                // get a list of all folders in the directory
                const files = fs.readdirSync(tempPath)
                return responseUtility.success({"files": files, "status": "returned list of files"}, 200)
            } else {
                // Get zip from FTP
                console.log("zip file not found, downloading from FTP")
                if (!fs.existsSync(`temp/mri-download/${fileName}`)) {
                    // If the zip file doesn't exist, download it from the FTP server
                    const connection = _params.connection || unique()
                    try {
                        // Search for the zip file in the FTP server
                        await ftpUtility.connect(connection)
                        await ftpUtility.cd(connection, filePath, false)
                        const lsResponse = await ftpUtility.ls(connection)
                        const files = lsResponse.files

                        if (!files.find(e => e.name === fileName)) {
                            // Return error if zip file is not found
                            return responseUtility.error('exam.mri.get.not_found')
                        } else {
                            // Download the zip file if the desired zip file is found
                            if (!fs.existsSync(`temp/mri-download`)) {
                                fs.mkdirSync(`temp/mri-download`, {recursive: true})
                            }
                            await ftpUtility.downloadTo(connection, `temp/mri-download/${fileName}`, `${filePath}/${fileName}`)
                        }
                    } catch (e) {
                        console.log('error while connecting to FTP and downloading zip file', e)
                        return responseUtility.error('exam.mri.ftp_failure')
                    }
                }
                // Once we know the zip is in our server, we unzip it
                const zipPath = `temp/mri-download/${fileName}`
                let zipfile = new AdmZip(zipPath)

                try {
                    console.log("unzipping file at ", zipPath)
                    zipfile.extractAllTo(`temp/mri/`, true)
                } catch (e) {
                    console.log('error while unzipping', e)
                    return responseUtility.error('exam.mri.unzip_failure')
                }
                const directory_exists = fs.existsSync(tempPath)
                if (directory_exists) {
                    // get a list of all folders in the directory
                    const files = fs.readdirSync(tempPath)
                    return responseUtility.success({
                        "files": files,
                        "status": "returned list of series",
                        "path": tempPath
                    }, 200)
                } else {
                    console.log(`error while unzipping, the completed folder ${tempPath} was not found`)
                    return responseUtility.error('exam.mri.unzip_failure')
                }


            }
        } catch (error) {
            console.log('error', error)
            return responseUtility.error('exam.get.fail_action')
        }
    }

    /**
     * Will attempt to retrieve a list of images in the series folder given the following URL
     * /exams/mri/{examID}/{seriesID}/file_list.dcm
     * @param _params
     */
    async requestMRIFileList(_params){
        try{
            const exam = await ExamModel.findOne({where: {id: _params['examID']}})
            if (!exam) return responseUtility.error('exam.not_found')

            const patientID = exam.patient_id
            const examID = exam.id
            const tempPath = `temp/mri/${patientID}/${examID}`;
            const seriesID = _params['seriesID'];

            const directory_exists = fs.existsSync(tempPath)
            if (directory_exists) {
                if (!fs.existsSync(`${tempPath}/${seriesID}`)) {
                    console.log(`the series folder ${seriesID} was not found`)
                    return responseUtility.error('exam.mri.series_folder_not_found')
                }

                // get a list of all folders in the directory
                const files = fs.readdirSync(`${tempPath}/${seriesID}/`)

                return responseUtility.success({"files": files, "deliver_list": true}, 200)
            } else {
                console.log(`the folder ${tempPath} was not found`)
                return responseUtility.error('exam.mri.exam_folder_not_found')
            }
        } catch (error) {
            console.log('error', error)
            return responseUtility.error('exam.get.fail_action')
        }

    }

    /**
     * Will attempt to retrieve the path of an image given the following URL
     * @param _params
     */
    async requestMRIFile(_params: any) {
        try{
            const exam = await ExamModel.findOne({where: {id: _params['examID']}})
            if (!exam) return responseUtility.error('exam.not_found')

            const patientID = exam.patient_id
            const examID = exam.id
            const tempPath = `temp/mri/${patientID}/${examID}`;
            const seriesID = _params['seriesID'];
            const filename = _params['filename'];

            const fullImagePath = `${tempPath}/${seriesID}/${filename}`;
            const directory_exists = fs.existsSync(fullImagePath)
            if (directory_exists) {
                return responseUtility.success({"file": `${tempPath}/${seriesID}/${filename}`, "deliver_file": true}, 200)
            } else {
                console.log(`the image ${fullImagePath} was not found`)
                return responseUtility.error('exam.mri.mri_file_not_found')
            }
        } catch (error) {
            console.log('error', error)
            return responseUtility.error('exam.get.fail_action')
        }
    }
}

export const examService = new ExamService()
export { ExamService }