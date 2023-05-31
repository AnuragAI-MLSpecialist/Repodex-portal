import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { CategoryModel } from '../../../models/categories';
import { SearchHistoryModel } from '../../../models/search_historys';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';

class ApplicationSubCategory extends AppController {
    /* 
        --------------------------------------------------------------------------------
        application functions 
    */

    /**
     * @api {get} /v1/user/sub-category/list/dropdown/:categoryId (get sub category list for dropdown)
     * @apiName listAllSubCategory
     * @apiGroup ApplicationSubCategory
     *
     * @apiSuccess {Object} Category.
     */
    listAllSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info(`listAllSubCategory function started ${req.params.categoryId}`);

        try {
            const listSubCategory = await CategoryModel.find({
                $and: [{ _deleted: false }, { category_id: req.params.categoryId }, { is_active: true }]
            }).lean();

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Sub Category successfully listed',
                categoryList: listSubCategory
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
     * @api {get} v1/auth/user/sub-category/list/:skip/:limit?search={(searchBy):(string)} list sub category
     * @apiName listSubCategory
     * @apiGroup ApplicationSubCategory
     *
     * @apiSuccess {Object} SubCategory.
     */

    listSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listSubCategory function started');
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
                    if (searchBy === 'category_id') {
                        /**
                         * for description
                         */

                        filterQueryObj.category_id = new RegExp(`${searchValue}`, 'i');
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

            const listSubCategory = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { is_active: true }, { category_id: { $ne: null } }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 }
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'sub Category successfully listed',
                categoryList: listSubCategory
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
     * @api {get} v1/auth/user/sub-category/list-by-category/:category_id?search={(searchBy):(string)} list sub category by category_id
     * @apiName listSubCategoryByCategoryId
     * @apiGroup ApplicationSubCategory
     *
     * @apiSuccess {Object} SubCategory.
     */

    listSubCategoryByCategoryId = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listSubCategoryByCategoryId function started');
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
                    if (searchBy === 'category_id') {
                        /**
                         * for description
                         */

                        filterQueryObj.category_id = new RegExp(`${searchValue}`, 'i');
                    }
                }
            }

            const listSubCategory = await CategoryModel.paginate({
                query: {
                    $and: [
                        { _deleted: false },
                        { is_active: true },
                        { category_id: req.params.category_id },
                        { category_id: { $ne: null } },
                        filterQueryObj
                    ]
                },
                sort: { createdAt: -1 }
            });
            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Sub Category successfully listed',
                categoryList: listSubCategory
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

export default new ApplicationSubCategory();
