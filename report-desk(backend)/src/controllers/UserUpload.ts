import { logger } from '../utils/logger';
import fs from 'fs';
import path, { join } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import express from 'express';
import imageThumbnail from 'image-thumbnail';
import { fromPath } from 'pdf2pic';
// sudo apt-get update
// sudo apt-get install graphicsmagick
// sudo apt-get install imagemagick
dotenv.config();

const UPLOAD_DIR_DEFAULT = './public/stock';
const UPLOAD_DIR_REPORT = './public/report';
const MEDIA_LINK = process.env.MEDIA_LINK || 'http://localhost:4034/';

class Uploader {
    storage: any;
    upload_dir: any;

    constructor() {
        this.upload_dir = UPLOAD_DIR_DEFAULT;
        this.storage = undefined;
    }

    /**
     * Uploader Function
     * @param field (Field name in which file has been passed)
     * @param res (Express Response Object)
     * @param folder (Folder for image to placed)
     * @returns
     */
    uploader(field, res, folder = null) {
        logger.info('innn', field);
        return multer({
            storage: this.storage,
            fileFilter: (req, file, cb) => {
                logger.info('i file filter', file);
                this.checkFileType(file, cb, res);
            }
        }).single(field);
    }

    /**
     * Function to check mime type for file
     * @param file (File Object)
     * @param cb
     * @param res (Express Response Object)
     * @returns
     */
    checkFileType(file, cb, res) {
        logger.info(`!!!!!!!checkFileType Initial!!!!!!!!!! ${file.originalname} and ${file.mimetype}`);

        // Allowed ext
        const filetypes =
            // /image\/jpg|image\/jpeg|jpeg|jpg|png|xlsx|xls|application\/octet-stream|application\/vnd\.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv|jfif|aac|mp4|flv|avi|wav|m4a|wmv|mkv|ogg|mov|webm|pdf|3gp|audio\/mpeg|audio\/x-mpeg-3|audio\/wav|audio\/x-wav|audio\/ogg|audio\/x-ogg|audio\/m4a|audio\/aac|acc|audio\/acc|mp3/;
            /png|pdf/;

        // const filetypes = /image\/jpg|image\/jpeg|jpeg|jpg|png/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('File type not allowed');
        }
    }

    async addThumbNail(fileName: string, uploadDir: string) {
        const thumbFileName = uploadDir + '/thumb_' + fileName;
        logger.info(`!!!!!!!!!!!!!Pre Data!!!!!!!!!!!!!! ${fileName} and ${thumbFileName} and ${MEDIA_LINK}`);

        if (!fileName.includes('.pdf')) {
            if (uploadDir === UPLOAD_DIR_REPORT) {
                imageThumbnail({ uri: `${MEDIA_LINK}/report/${fileName}` })
                    .then((thumbnailData: any) => {
                        fs.writeFileSync(thumbFileName, thumbnailData);
                    })
                    .catch((err) => logger.info(`Error in generating thumbnail ${err}`));
            }
        } else {
            if (uploadDir === UPLOAD_DIR_REPORT) {
                const options = {
                    density: 100,
                    saveFilename: `thumb_${fileName.split('.')[0]}`,
                    savePath: `${uploadDir}`,
                    format: 'png',
                    width: 600,
                    height: 600
                };
                const storeAsImage = fromPath(`${uploadDir}/${fileName}`, options);
                storeAsImage(1).then((resolve) => {
                    return resolve;
                });
            }
        }
    }

    /**
     * Handler function to upload file
     * @returns Filename of the file which is stored in server
     */
    handler() {
        const app = express.Router();

        app.post('/:folder/:field', (req: any, res: any) => {
            logger.info(`Enter Upload ${req.params.folder} and ${req.params.field} and ${req.file} and ${req.uri}`);

            this.upload_dir =
                req.params.folder === 'report' && req.params.field === 'file' ? UPLOAD_DIR_REPORT : UPLOAD_DIR_DEFAULT;
            logger.info(`!!!!!!!!!!!!!!upload dir!!!!!!!!!!!!!!!!!!!! ${this.upload_dir}`);

            /**
             * Assign storage
             */
            this.storage = multer.diskStorage({
                destination: this.upload_dir,
                filename(request, file, cb) {
                    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
                }
            });

            /**
             * Assigning upload function
             */
            const upload = this.uploader(req.params.field || 'file', res, req.params.folder);

            upload(req, res, (err) => {
                logger.info(`in upload function ${req.file}`);
                if (err) {
                    logger.info(`!!!!!!!!!!!First Err!!!!!!!!! ${err}`);
                    res.status(500).send({
                        code: 'ERROR_IN_UPLOAD',
                        message: err,
                        status: 500
                    });
                } else {
                    if (req.file === undefined) {
                        logger.info('Error: No File Selected!');
                        res.status(500).send({
                            code: 'NO_FILE',
                            message: 'No file selected',
                            status: 500
                        });
                    } else {
                        logger.info('File Uploaded!');
                        this.addThumbNail(req.file.filename, this.upload_dir);
                        res.status(200).send({
                            message: 'File uploaded successfully',
                            status: 200,
                            code: 'FILE_UPLOADED',
                            file: `${req.file.filename}`
                        });
                    }
                }
            });
        });

        return app;
    }
}

export default new Uploader().handler();
