import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { ReportModel } from '../../../models/reports';
import { CategoryModel } from '../../../models/categories';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import AppController from '../../super/AppController';
import fs from 'fs';
const UPLOAD_DIR_REPORT = './public/report';

import dotenv from 'dotenv';
dotenv.config();

class Report extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {put} v1/auth/admin/report/status/:report_id (change Report status)
     * @apiName changeReportStatus
     * @apiGroup adminReport
     *
     * @apiParam {String} flag flag of the report(true/false).
     *
     * @apiSuccess {Object} Object .
     */
    changeReportStatus = async (req: Request, res: Response) => {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Provide at least one parameter in body');
            }

            const { flag } = req.body;

            const foundReport = await ReportModel.findOne({ _id: req.params.report_id });

            if (!foundReport) {
                throw new Error('Report not found');
            }

            if (foundReport._deleted) {
                throw new Error('This Report has been deleted');
            }

            await ReportModel.findOneAndUpdate({ _id: req.params.report_id }, { is_active: flag });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully changed status'
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });
        }
    };

    /**
     * @api {post} /v1/auth/admin/report create report
     * @apiName createReport
     * @apiGroup adminReport
     *
     * @apiParam {String} name name of the report.(required)
     * @apiParam {String} type type of the report.('Whitepaper' | 'Research Report' | 'Research Paper')
     * @apiParam {String} format format of report.('pdf' | 'png')
     * @apiParam {String} region region of report.('North America' | 'Global' | 'South Africa')
     * @apiParam {Number} published_year published_year of report
     * @apiParam {String} category_id category_id of report
     * @apiParam {String} sub_category_id sub_category_id of report
     * @apiParam {Boolean} is_free is_free or not
     * @apiParam {String} report_filename uploaded file name
     * @apiParam {Boolean} is_active status of report
     * @apiParam {String} description description of report
     *
     * @apiSuccess {Object} report.
     */

    createReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createReport function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const {
                name,
                description,
                is_active,
                type,
                format,
                region,
                regions,
                published_year,
                category_id,
                sub_category_id,
                is_free,
                report_filename,
                country,
                countries
            } = req.body;

            if (!name || !category_id || !sub_category_id) {
                throw new Error('Please provide a all data');
            }

            const categoryData = await CategoryModel.findOne({
                _id: category_id
            });

            const subCategoryData = await CategoryModel.findOne({
                _id: sub_category_id
            });

            if (!categoryData || !subCategoryData) {
                throw new Error('Please provide valid categoryId or subCategoryId');
            }

            const foundReport = await ReportModel.findOne({ name });

            if (foundReport) {
                throw new Error('Reoprt already exist');
            }

            const createObject: { [key: string]: any } = {
                name,
                is_active,
                category_id,
                sub_category_id,
                is_free,
                report_upload_date: new Date()
            };

            if (description) {
                createObject.description = description;
            }
            if (type) {
                createObject.type = type;
            }
            if (format) {
                createObject.format = format;
            }
            if (region) {
                createObject.region = region;
            }
            if (regions) {
                createObject.regions = regions;
            }
            if (countries) {
                createObject.countries = countries;
            }
            if (country) {
                createObject.country = country;
            }
            if (published_year) {
                createObject.published_year = published_year;
            }

            if (report_filename) {
                createObject.report_filename = report_filename;
                createObject.report_url = process.env.SERVER_URL + 'report/' + report_filename;
                if (!report_filename.includes('.pdf')) {
                    createObject.thumb_report_filename = `thumb_${report_filename}`;
                    createObject.thumb_report_url = process.env.SERVER_URL + 'report/' + `thumb_${report_filename}`;
                } else {
                    createObject.thumb_report_filename = `thumb_${report_filename.split('.')[0]}.1.png`;
                    createObject.thumb_report_url =
                        process.env.SERVER_URL + 'report/' + `thumb_${report_filename.split('.')[0]}.1.png`;
                }
            }

            const createReport = await ReportModel.create(createObject);

            await CategoryModel.findOneAndUpdate(
                {
                    _id: category_id
                },
                { $inc: { total_reports: 1 } }
            );

            await CategoryModel.findOneAndUpdate(
                {
                    _id: sub_category_id
                },
                { $inc: { total_reports: 1 } }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Report successfully Created',
                adminData: createReport
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });
            return;
        }
    };

    /**
     * @api {put} /v1/auth/admin/report edit report
     * @apiName editReport
     * @apiGroup adminReport
     *
     * @apiParam {string} id id of the report.(required)
     * @apiParam {String} type type of the report.('Whitepaper' | 'Research Report' | 'Research Paper')
     * @apiParam {String} format format of report.('pdf' | 'png')
     * @apiParam {String} region region of report.('North America' | 'Global' | 'South Africa')
     * @apiParam {String} country country of report
     * @apiParam {Number} published_year published_year of report
     * @apiParam {String} category_id category_id of report
     * @apiParam {String} sub_category_id sub_category_id of report
     * @apiParam {Boolean} is_free is_free or not
     * @apiParam {String} report_filename uploaded file name
     * @apiParam {Boolean} is_active status of report
     * @apiParam {String} description description of report
     *
     * @apiSuccess {Object} Report.
     */

    editReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('editReport function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }
            const updateObject: any = {};

            const {
                id,
                name,
                description,
                type,
                format,
                region,
                published_year,
                category_id,
                sub_category_id,
                is_free,
                report_filename,
                country,
                regions,
                countries
            } = req.body;

            if (!id) {
                throw new Error('Please provide a required data');
            }

            const foundReport = await ReportModel.findOne({ _id: id });

            if (!foundReport) {
                throw new Error('report does not exist');
            }

            if (category_id) {
                const categoryData = await CategoryModel.findOne({
                    _id: category_id
                });

                if (!categoryData) {
                    throw new Error('Please provide valid categoryId');
                }

                updateObject.category_id = category_id;
            }

            if (sub_category_id) {
                const subCategoryData = await CategoryModel.findOne({
                    _id: sub_category_id
                });

                if (!subCategoryData) {
                    throw new Error('Please provide valid subCategoryId');
                }

                updateObject.sub_category_id = sub_category_id;
            }

            if (is_free) {
                updateObject.is_free = is_free;
            }

            if (type) {
                updateObject.type = type;
            }

            if (format) {
                updateObject.format = format;
            }

            if (region) {
                updateObject.region = region;
            }

            if (country) {
                updateObject.country = country;
            }

            if (regions) {
                updateObject.regions = regions;
            }

            if (countries) {
                updateObject.countries = countries;
            }

            if (published_year) {
                updateObject.published_year = published_year;
            }

            if (report_filename) {
                if (foundReport.report_filename !== report_filename) {
                    // delete old one
                    if (fs.existsSync(`${UPLOAD_DIR_REPORT}${foundReport.report_filename}`)) {
                        fs.unlinkSync(`${UPLOAD_DIR_REPORT}${foundReport.report_filename}`);
                    }

                    updateObject.report_filename = report_filename;
                    updateObject.report_url = process.env.SERVER_URL + '/report/' + report_filename;
                    if (!report_filename.includes('.pdf')) {
                        updateObject.thumb_report_filename = `thumb_${report_filename}`;
                        updateObject.thumb_report_url = process.env.SERVER_URL + 'report/' + `thumb_${report_filename}`;
                    } else {
                        updateObject.thumb_report_filename = `thumb_${report_filename.split('.')[0]}.1.png`;
                        updateObject.thumb_report_url =
                            process.env.SERVER_URL + 'report/' + `thumb_${report_filename.split('.')[0]}.1.png`;
                    }
                }
            }

            if (name) {
                const report = await ReportModel.findOne({
                    $and: [{ name }, { _id: { $ne: id } }, { _deleted: false }]
                });

                if (report) {
                    throw new Error('Report with this name already exists');
                }

                updateObject.name = name;
            }

            if (description) {
                updateObject.description = description;
            }

            await ReportModel.findOneAndUpdate({ _id: id }, updateObject);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Report successfully edited'
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });

            return;
        }
    };

    /**
     * @api {get} /v1/auth/admin/report/list/:skip/:limit?search={(searchBy):(string)} get report list
     * @apiName listReport
     * @apiGroup adminReport
     *
     * @apiSuccess {Object} Report.
     */

    listReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listReport function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            let filterQueryObj: any = {};
            let searchValueForCategory;

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;
                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        // filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                        filterQueryObj = {
                            $or: [
                                {
                                    name: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    description: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    type: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    region: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    country: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    format: new RegExp(`${searchValue}`, 'i')
                                }
                            ]
                        };
                        searchValueForCategory = searchValue;
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */

                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'type') {
                        /**
                         * for description
                         */

                        filterQueryObj.type = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'region') {
                        /**
                         * for description
                         */

                        filterQueryObj.region = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'country') {
                        /**
                         * for description
                         */

                        filterQueryObj.country = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'format') {
                        /**
                         * for description
                         */

                        filterQueryObj.format = new RegExp(`${searchValue}`, 'i');
                    }
                }
            }

            const skip: number = Number(req.params.skip) || 0;
            const limit: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skip > 0) {
                page = Math.ceil(skip / limit + 1);
            }

            const listReport: any = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            if (listReport?.docs?.length > 0) {
                res.json({
                    status: httpStatusCodes.SUCCESS_CODE,
                    message: 'report successfully listed',
                    listReportData: listReport
                });

                return;
            }

            /**
             * Search category using searchText as subcategory not found with searchText
             */
            const listSearchCategory = await CategoryModel.find(
                {
                    $and: [
                        { _deleted: false },
                        { category_id: null },
                        { name: new RegExp(`${searchValueForCategory}`, 'i') }
                    ]
                },
                { _id: 1 }
            ).lean();
            const categoryIds = listSearchCategory.map((category: any) => category._id);
            logger.info(`!!!!!!categoryIds: ${categoryIds}`);

            const listReportByCategory: any = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { category_id: { $in: categoryIds } }]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            if (listReportByCategory?.docs?.length > 0) {
                res.json({
                    status: httpStatusCodes.SUCCESS_CODE,
                    message: 'report successfully listed',
                    listReportData: listReportByCategory
                });

                return;
            }

            /**
             * Search category using searchText as subcategory not found with searchText
             */
            const listSearchSubCategory = await CategoryModel.find(
                {
                    $and: [
                        { _deleted: false },
                        { category_id: { $ne: null } },
                        { name: new RegExp(`${searchValueForCategory}`, 'i') }
                    ]
                },
                { _id: 1 }
            ).lean();
            const subCategoryIds = listSearchSubCategory.map((category: any) => category._id);
            logger.info(`!!!!!!SubCategoryIds: ${subCategoryIds}`);

            const listReportBySubCategory: any = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { sub_category_id: { $in: subCategoryIds } }]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                listReportData: listReportBySubCategory
            });

            return;
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });

            return;
        }
    };

    /**
     * @api {delete} /v1/auth/admin/report/:reportId delete report
     * @apiName deleteReport
     * @apiGroup adminReport
     *
     * @apiSuccess {Object} report.
     */

    deleteReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('deleteReport function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            if (!req.params.reportId) {
                throw new Error('Please provide reportId');
            }
            await ReportModel.findOneAndUpdate(
                { _id: req.params.reportId },
                {
                    _deleted: true
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Report successfully deleted'
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });

            return;
        }
    };
}

export default new Report();
