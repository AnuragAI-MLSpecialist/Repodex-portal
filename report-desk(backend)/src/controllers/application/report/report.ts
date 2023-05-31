import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { ReportDocument, ReportModel } from '../../../models/reports';
import { UserReportDownloadModel } from '../../../models/user_report_download';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super/AppController';
import mailerService from '../../mailerService';
import bcrypt from 'bcrypt';
import fs from 'fs';
import _ from 'lodash';

import dotenv from 'dotenv';
dotenv.config();

class Report extends AppController {
    /* 
        --------------------------------------------------------------------------------
        application functions 
    */

    /**
     * @api {get} /v1/user/report/pdf/home/list get pdf report list for home screen for pdf type
     * @apiName listPdfReportHome
     * @apiGroup ApplicationReport
     *
     * @apiSuccess {Object} Report.
     */

    listPdfReportHome = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listPdfReportHome function started');
        try {
            const listReport = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, { format: 'pdf' }]
                },
                limit: 6,
                page: 1,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                listReportData: listReport
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
     * @api {get} /v1/user/report/all/home/list get pdf report list for home screen for all type
     * @apiName listAllReportHome
     * @apiGroup ApplicationReport
     *
     * @apiSuccess {Object} Report.
     */

    listAllReportHome = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listAllReportHome function started');
        try {
            const listReport = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, { type: 'Infographic' }]
                },
                limit: 6,
                page: 1,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                listReportData: listReport
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
     * @api {post} /v1/user/report/all/similar/list/:skip/:limit (get similar report list for all type)
     * @apiName listAllSimilarReports
     * @apiGroup ApplicationReport
     *
     * @apiParam {String} report_id report_id
     *
     * @apiSuccess {Object} Report.
     */
    listAllSimilarReports = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listAllSimilarReports function started');
        try {
            const { report_id } = req.body;

            if (!report_id) {
                throw new Error('report_id is required');
            }

            const currentReportDetail = await ReportModel.findOne({ _id: report_id, _deleted: false, is_active: true });

            if (!currentReportDetail) {
                throw new Error('Report not found');
            }

            const skip: number = Number(req.params.skip) || 0;
            const limit: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skip > 0) {
                page = Math.ceil(skip / limit + 1);
            }

            const listReport = await ReportModel.paginate({
                query: {
                    $and: [
                        { _deleted: false },
                        { is_active: true },
                        {
                            $or: [
                                {
                                    category_id: {
                                        $in: [currentReportDetail.category_id]
                                    }
                                },
                                {
                                    sub_category_id: {
                                        $in: [currentReportDetail.sub_category_id]
                                    }
                                }
                            ]
                        },
                        {
                            _id: {
                                $ne: report_id
                            }
                        }
                    ]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                listReportData: listReport
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
     * @api {post} /v1/user/report/list/:skip/:limit?search={(searchBy):(string)} get report list
     * @apiName listReport
     * @apiGroup ApplicationReport
     *
     * @apiParam {String} category_id category_id of the report
     * @apiParam {String} sub_category_id sub_category_id of the report
     * @apiParam {String} published_year published_year of the report
     * @apiParam {String} region region of the report
     * @apiParam {String} country country of the report
     * @apiParam {String} country country of the report
     * @apiParam {String} report_type report_type of the report
     *
     * @apiSuccess {Object} Report.
     */

    listReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listReport.. function started');
        try {
            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {};

            if (req.body.category_id) {
                filterQueryObj.category_id = req.body.category_id;
            }

            if (req.body.sub_category_id) {
                filterQueryObj.sub_category_id = req.body.sub_category_id;
            }

            if (req.body.published_year) {
                filterQueryObj.published_year = req.body.published_year;
            }

            if (req.body.type) {
                filterQueryObj.type = req.body.type;
            }

            if (req.body.region) {
                // filterQueryObj.region = req.body.region;
                filterQueryObj[`regions.region`] = {
                    $in: typeof req.body.region === 'string' ? [req.body.region] : req.body.region
                };
            }

            if (req.body.country) {
                // filterQueryObj.country = req.body.country;
                filterQueryObj[`countries.country`] = {
                    $in: typeof req.body.country === 'string' ? [req.body.country] : req.body.country
                };
            }

            if (req.body.report_type) {
                filterQueryObj.type = req.body.report_type;
            }

            if (typeof search === 'string') {
                /**
                 * filter data by search query
                 */
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;
                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */

                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'type') {
                        /**
                         * for type
                         */

                        filterQueryObj.type = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'region') {
                        /**
                         * for region
                         */

                        filterQueryObj.region = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'format') {
                        /**
                         * for format
                         */

                        filterQueryObj.format = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'published_year') {
                        /**
                         * for published_year
                         */

                        filterQueryObj.published_year = searchValue;
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

            logger.info(`!!!!Skip and Limit!!!!!! ${skip} and ${limit} and ${page}`);

            logger.info(`!!!!!!filterQueryObj!!!!! ${JSON.stringify(filterQueryObj, null, 2)}`);

            const listReport: any = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });
            // logger.info(`!!!!!!listReport!!!!! ${JSON.stringify(listReport, null, 2)}`)

            const responseData: any = [];
            listReport.docs.forEach((report: any) => {
                if (report.category_id && report.category_id.is_active) {
                    responseData.push(report);
                }
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                listReportData: {
                    ...listReport,
                    docs: responseData
                }
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
     * @api {get} /v1/user/report/:report_id get report by id
     * @apiName getReportById
     * @apiGroup ApplicationReport
     *
     * @apiSuccess {Object} Report.
     */

    getReportById = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('getReportById function started');
        try {
            await ReportModel.findOneAndUpdate(
                {
                    _id: req.params.report_id
                },
                { $inc: { views: 1 } }
            );

            const reportData = await ReportModel.findOne({
                _id: req.params.report_id
            })
                .populate('category_id')
                .populate('sub_category_id')
                .lean();

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully listed',
                reportData
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
     * @api {get} /v1/auth/user/report/download/:report_id (download report)
     * @apiName downloadReport
     * @apiGroup ApplicationReport
     *
     * @apiSuccess {Object} Report.
     */
    downloadReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('downloadReport function started');
        try {
            const reportData = await ReportModel.findOne({
                _id: req.params.report_id
            });

            if (!reportData) {
                throw new Error('Please provide valid report id');
            }

            const existDownloadReport = await UserReportDownloadModel.findOne({
                user_id: req[`user`].id,
                report_id: req.params.report_id
            });

            if (existDownloadReport) {
                await UserReportDownloadModel.findOneAndUpdate(
                    {
                        report_id: req.params.report_id,
                        user_id: req[`user`].id
                    },
                    {
                        downloaded_at: new Date()
                    }
                );
            } else {
                await UserReportDownloadModel.create({
                    report_id: req.params.report_id,
                    category_id: reportData.category_id,
                    sub_category_id: reportData.sub_category_id,
                    region: reportData.region,
                    country: reportData.country,
                    regions: reportData.regions,
                    countries: reportData.countries,
                    type: reportData.type,
                    user_id: req[`user`].id,
                    downloaded_at: new Date()
                });
            }

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'report successfully downloaded',
                data: reportData.report_url
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
     * @api {post} /v1/auth/user/report/download/list/:skip/:limit (List downloaded report for login user)
     * @apiName listDownloadReport
     * @apiGroup ApplicationReport
     *
     * @apiParam {String} category_id category_id of the report
     * @apiParam {String} sub_category_id sub_category_id of the report
     * @apiParam {String} region sub_category_id of the report
     * @apiParam {String} country country of the report
     *
     *
     * @apiSuccess {Object} Report.
     */
    listDownloadReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listDownloadReport function started');
        try {
            const totalDownloadCount = await UserReportDownloadModel.count({
                user_id: super.toObjectId(req[`user`].id)
            });

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {
                user_id: super.toObjectId(req[`user`].id)
            };

            if (req.body.category_id) {
                filterQueryObj.category_id = super.toObjectId(req.body.category_id);
            }

            if (req.body.sub_category_id) {
                filterQueryObj.sub_category_id = super.toObjectId(req.body.sub_category_id);
            }

            // if (req.body.region) {
            //     filterQueryObj.region = req.body.region;
            // }

            // if (req.body.country) {
            //     filterQueryObj.country = req.body.country;
            // }
            if (req.body.type) {
                logger.info(`In type filter`);
                filterQueryObj.type = req.body.type;
            }

            if (req.body.region) {
                // filterQueryObj.region = req.body.region;
                filterQueryObj[`regions.region`] = {
                    $in: typeof req.body.region === 'string' ? [req.body.region] : req.body.region
                };
            }

            if (req.body.country) {
                // filterQueryObj.country = req.body.country;
                filterQueryObj[`countries.country`] = {
                    $in: typeof req.body.country === 'string' ? [req.body.country] : req.body.country
                };
            }

            const skip: number = Number(req.params.skip) || 0;
            const limit: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skip > 0) {
                page = Math.ceil(skip / limit + 1);
            }

            logger.info(
                '!!!!!filterQueryObj!!!!',
                JSON.stringify(filterQueryObj, null, 2),
                JSON.stringify(req.body, null, 2)
            );

            const listReport: any = await UserReportDownloadModel.paginate({
                query: {
                    $and: [{ _deleted: false }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }, { path: 'report_id' }]
            });

            const groupedCategoryData =
                listReport && listReport.docs && listReport.docs.length > 0
                    ? _.groupBy(listReport.docs, 'category_id.name')
                    : [];

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'downloaded report successfully listed',
                data: {
                    totalDownloadCount,
                    list: listReport,
                    groupedCategoryData
                }
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
