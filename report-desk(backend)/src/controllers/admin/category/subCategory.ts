import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { CategoryModel } from '../../../models/categories';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';

class SubCategory extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {get} /v1/auth/admin/sub-category/list/dropdown/:categoryId (get sub category list for dropdown)
     * @apiName listAllCategory
     * @apiGroup adminCategory
     *
     * @apiSuccess {Object} Category.
     */
    listAllSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info(`listAllSubCategory function started ${req.params.categoryId}`);

        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

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
     * @api {put} v1/auth/admin/sub-category/status/:subCategoryId (change sub_category status)
     * @apiName changeSubCategoryStatus
     * @apiGroup adminCategory
     *
     * @apiParam {String} flag flag of the subCategory(true/false).
     *
     * @apiSuccess {Object} Object .
     */
    changeSubCategoryStatus = async (req: Request, res: Response) => {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Provide at least one parameter in body');
            }

            const { flag } = req.body;

            const foundSubCategory = await CategoryModel.findOne({ _id: req.params.subCategoryId });

            if (!foundSubCategory) {
                throw new Error('Category not found');
            }

            if (foundSubCategory._deleted) {
                throw new Error('This subCategory has been deleted');
            }

            await CategoryModel.findOneAndUpdate({ _id: req.params.subCategoryId }, { is_active: flag });

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
     * @api {post} v1/auth/admin/sub-category/create create sub-category
     * @apiName createSubCategory
     * @apiGroup adminSubCategory
     *
     * @apiParam {string} name name of the Sub_category.(required)
     * @apiParam {string} category_id category_id of the Sub_category.(required)
     * @apiParam {String} description description of the Sub_category.
     * @apiParam {Boolean} is_active status of sub_category
     *
     * @apiSuccess {Object} Sub_category.
     */

    createSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createSubCategory function started');
        try {
            if (!req.body.name || !req.body.category_id) {
                throw new Error('please provide required field');
            }

            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { name, description, category_id, is_active } = req.body;

            const foundSubCategory = await CategoryModel.findOne({ name, category_id });

            if (foundSubCategory) {
                throw new Error('Sub Category already exist');
            }

            const foundCategory = await CategoryModel.findOne({ _id: category_id });

            if (!foundCategory) {
                throw new Error('please provide valid category id');
            }

            const createSubCategory = await CategoryModel.create({
                name,
                description,
                category_id,
                is_active
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'sub Category successfully Created',
                adminData: createSubCategory
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
     * @api {put} v1/auth/admin/sub-category/edit edit sub category
     * @apiName editSubCategory
     * @apiGroup adminSubCategory
     *
     * @apiParam {string} id id of the sub category.(required)
     * @apiParam {string} category_id category_id of the Sub_category.
     * @apiParam {string} name name of the sub category.
     * @apiParam {String} description description of the sub category.
     * @apiParam {Number} total_reports total_reports of the sub category.
     *
     * @apiSuccess {Object} Category.
     */

    editSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('editSubCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { id, name, description, total_reports, category_id } = req.body;

            if (!id) {
                throw new Error('please provide required field');
            }

            const updateObject: any = {};

            if (name) {
                const subCategory = await CategoryModel.findOne({
                    $and: [{ name }, { _id: { $ne: id } }, { _deleted: false }]
                });
                if (subCategory) {
                    throw new Error('Sub Category with this name already exists');
                }

                updateObject.name = name;
            }

            if (description) {
                updateObject.description = description;
            }

            if (total_reports) {
                updateObject.total_reports = total_reports;
            }

            if (category_id) {
                const foundCategory = await CategoryModel.findOne({ _id: category_id });

                if (!foundCategory) {
                    throw new Error('please provide valid category id');
                }

                updateObject.category_id = category_id;
            }

            await CategoryModel.findOneAndUpdate({ _id: id }, updateObject);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'sub Category successfully edited'
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
     * @api {get} v1/auth/admin/sub-category/list/:skip/:limit?search={(searchBy):(string)} get sub category list
     * @apiName listSubCategory
     * @apiGroup adminSubCategory
     *
     * @apiSuccess {Object} Sub_category.
     */

    listSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listSubCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            const filterQueryObj: { [key: string]: any } = {};

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

                        filterQueryObj.name = new RegExp(`${searchValue}`, 'i');
                        searchValueForCategory = searchValue;
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

            const listSubCategory: any = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { category_id: { $ne: null } }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }]
            });

            if (listSubCategory?.docs?.length > 0) {
                res.json({
                    status: httpStatusCodes.SUCCESS_CODE,
                    message: 'Sub Category successfully listed',
                    categoryList: listSubCategory
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

            const listSubCategoryByCategory: any = await CategoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, { category_id: { $in: categoryIds } }]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: [{ path: 'category_id' }]
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Sub Category successfully listed',
                categoryList: listSubCategoryByCategory
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
     * @api {delete} v1/auth/admin/sub-category/:subCategoryId delete sub category
     * @apiName deleteSubCategory
     * @apiGroup adminSubCategory
     *
     * @apiSuccess {Object} Sub_category.
     */

    deleteSubCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('deleteSubCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            if (!req.params.subCategoryId) {
                throw new Error('Please provide subCategoryId');
            }

            await CategoryModel.findOneAndUpdate(
                { _id: req.params.subCategoryId },
                {
                    _deleted: true
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'sub Category successfully deleted'
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

export default new SubCategory();
