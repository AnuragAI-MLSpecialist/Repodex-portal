import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { CategoryDocument, CategoryModel } from '../../../models/categories';
import { SearchHistoryModel } from '../../../models/search_historys';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';
import { ReportModel } from '../../../models/reports';

class ApplicationCategory extends AppController {
    /* 
        --------------------------------------------------------------------------------
        application functions 
    */

    /**
     * @api {get} /v1/user/category/list/dropdown (get category list for dropdown)
     * @apiName listAllCategory
     * @apiGroup ApplicationCategory
     *
     * @apiSuccess {Object} Category.
     */
    listAllCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listAllCategory function started');
        try {
            const listCategory = await CategoryModel.find({
                $and: [{ _deleted: false }, { category_id: null }, { is_active: true }]
            }).lean();

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully listed',
                categoryList: listCategory
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
     * @api {get} v1/user/home/category/list/:skip/:limit?search={(searchBy):(string)} list home category
     * @apiName listHomeCategory
     * @apiGroup ApplicationCategory
     *
     * @apiSuccess {Object} Category.
     */
    listHomeCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listHomeCategory function started');
        try {
            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {};

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;

                    // await SearchHistoryModel.create({ text: searchValue });

                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */

                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
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

            const listCategory = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 }
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully listed',
                categoryList: listCategory
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
     * @api {get} v1/user/home/category/top/list/:skip/:limit?search={(searchBy):(string)} list home top category
     * @apiName listHomeTopCategory
     * @apiGroup ApplicationCategory
     *
     * @apiSuccess {Object} Category.
     */
    listHomeTopCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listHomeTopCategory function started');
        try {
            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {};

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;

                    // await SearchHistoryModel.create({ text: searchValue });

                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */

                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
                    }

                    logger.info('!!!!filterQueryObj!!!!!!', filterQueryObj, searchBy, searchValue);
                }
            }

            logger.info('!!!!filterQueryObj!!!!!!', filterQueryObj, search);

            const skip: number = Number(req.params.skip) || 0;
            const limit: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skip > 0) {
                page = Math.ceil(skip / limit + 1);
            }

            const listCategory = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, filterQueryObj]
                },
                limit,
                page,
                sort: { total_reports: -1, createdAt: -1 },
                populate: [{ path: 'category_id', select: 'is_active' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully listed',
                categoryList: listCategory
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
     * @api {get} v1/user/home/report/top/list/:skip/:limit?search={(searchBy):(string)} list home top report
     * @apiName listHomeTopCategory
     * @apiGroup ApplicationCategory
     *
     * @apiSuccess {Object} Category.
     */
    listHomeTopReport = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listHomeTopReport function started');
        try {
            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: any = [];
            // const filterSecondQueryObj: any = [];

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;

                    // await SearchHistoryModel.create({ text: searchValue });

                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        filterQueryObj.push({
                            name: new RegExp(`${searchValue}`, 'i')
                        });
                        filterQueryObj.push({
                            description: new RegExp(`${searchValue}`, 'i')
                        });
                        filterQueryObj.push({
                            name: new RegExp(`^${searchValue}.*`, 'i')
                        });
                        filterQueryObj.push({
                            description: new RegExp(`^${searchValue}.*`, 'i')
                        });
                        // filterSecondQueryObj.push({
                        //     $text: {
                        //        $search: searchValue
                        //    }
                        // })
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */
                        filterQueryObj.push({
                            name: new RegExp(`${searchValue}`, 'i')
                        });
                        filterQueryObj.push({
                            description: new RegExp(`${searchValue}`, 'i')
                        });
                        // filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
                    }

                    logger.info(
                        `!!!!filterQueryObj ${JSON.stringify(
                            filterQueryObj,
                            null,
                            2
                        )} and ${searchBy} and ${searchValue}!!!!!!`
                    );
                }
            }

            // logger.info(`!!!!filterSecondQueryObj ${filterQueryObj.length > 0} ${JSON.stringify(filterSecondQueryObj, null, 2)}!!!!!!`);

            const skip: number = Number(req.params.skip) || 0;
            const limit: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skip > 0) {
                page = Math.ceil(skip / limit + 1);
            }

            if (filterQueryObj && filterQueryObj.length > 0) {
                const listFilterReport = await ReportModel.paginate({
                    query: {
                        $and: [{ _deleted: false }, { is_active: true }, { $or: filterQueryObj }]
                    },
                    limit,
                    page,
                    sort: { createdAt: -1 },
                    populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
                });

                // let listFilterReportSecond;
                // try {
                //     logger.info('!!!!Applying Extra!!!!!!');
                //     listFilterReportSecond = await ReportModel.search({
                //         query_string: {
                //             query: 'India Health'
                //         }
                //     });
                //     logger.info(`!!!!Applying Extra!!!!!! ${JSON.stringify(listFilterReportSecond, null, 2)}`);
                // } catch (e) {
                //     logger.error(`!!!!Applying Extra!!!!!! ${e}`);
                // }

                res.json({
                    status: httpStatusCodes.SUCCESS_CODE,
                    message: 'Report successfully listed',
                    categoryList: listFilterReport
                    // newData: listFilterReportSecond
                });

                return;
            }

            const listReport = await ReportModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }, { path: 'sub_category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Report successfully listed',
                categoryList: listReport
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
     * @api {get} v1/auth/user/category/list/:skip/:limit?search={(searchBy):(string)} list category
     * @apiName listCategory
     * @apiGroup ApplicationCategory
     *
     * @apiSuccess {Object} Category.
     */
    listCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listCategory function started');
        try {
            if (!req[`user`]) {
                throw new Error('Please login again');
            }

            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {};

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;

                    // await SearchHistoryModel.create({ text: searchValue });

                    if (searchBy === 'name') {
                        /**
                         * for name
                         */

                        filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                    }
                    if (searchBy === 'description') {
                        /**
                         * for description
                         */

                        filterQueryObj.description = new RegExp(`${searchValue}`, 'i');
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

            const listCategory = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, { category_id: null }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 }
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully listed',
                categoryList: listCategory
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

export default new ApplicationCategory();
