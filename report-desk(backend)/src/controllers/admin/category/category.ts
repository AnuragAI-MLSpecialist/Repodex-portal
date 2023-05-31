import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { CategoryDocument, CategoryModel } from '../../../models/categories';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';
import mailerService from '../../mailerService';
import bcrypt from 'bcrypt';

class Category extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {get} /v1/auth/admin/category/list/dropdown (get category list for dropdown)
     * @apiName listAllCategory
     * @apiGroup adminCategory
     *
     * @apiSuccess {Object} Category.
     */

    listAllCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

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
     * @api {put} v1/auth/admin/category/status/:categoryId (change category status)
     * @apiName changeCategoryStatus
     * @apiGroup adminCategory
     *
     * @apiParam {String} flag flag of the category(true/false).
     *
     * @apiSuccess {Object} Object .
     */
    changeCategoryStatus = async (req: Request, res: Response) => {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Provide at least one parameter in body');
            }

            const { flag } = req.body;

            const foundCategory = await CategoryModel.findOne({ _id: req.params.categoryId });

            if (!foundCategory) {
                throw new Error('Category not found');
            }

            if (foundCategory._deleted) {
                throw new Error('This Category has been deleted');
            }

            await CategoryModel.findOneAndUpdate({ _id: req.params.categoryId }, { is_active: flag });

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
     * @api {post} /v1/auth/admin/category create category
     * @apiName createCategory
     * @apiGroup adminCategory
     *
     * @apiParam {String} name name of the category.(required)
     * @apiParam {String} description description of the category.
     * @apiParam {Boolean} is_active status of category(true|false).
     *
     * @apiSuccess {Object} Category.
     */

    createCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { name, description, is_active } = req.body;

            if (!name) {
                throw new Error('Please provide a name');
            }

            const foundCategory = await CategoryModel.findOne({ name });

            if (foundCategory) {
                throw new Error('Category already exist');
            }

            const createCategory = await CategoryModel.create({
                name,
                description,
                is_active
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully Created',
                adminData: createCategory
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
     * @api {put} /v1/auth/admin/category edit category
     * @apiName editCategory
     * @apiGroup adminCategory
     *
     * @apiParam {string} id id of the category.(required)
     * @apiParam {string} name name of the category.
     * @apiParam {String} description description of the category.
     * @apiParam {Number} total_reports total_reports of the category.
     *
     * @apiSuccess {Object} Category.
     */

    editCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('editCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { id, name, description } = req.body;

            if (!id) {
                throw new Error('please provide required field');
            }
            const updateObject: any = {};

            if (name) {
                const category = await CategoryModel.findOne({
                    $and: [{ name }, { _id: { $ne: id } }, { _deleted: false }]
                });

                if (category) {
                    throw new Error('Category with this name already exists');
                }

                updateObject.name = name;
            }

            if (description) {
                updateObject.description = description;
            }

            await CategoryModel.findOneAndUpdate({ _id: id }, updateObject);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully edited'
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
     * @api {get} /v1/auth/admin/category/list/:skip/:limit?search={(searchBy):(string)} get category list
     * @apiName listCategory
     * @apiGroup adminCategory
     *
     * @apiSuccess {Object} Category.
     */

    listCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listCategory function started');
        try {
            if (!req[`admin`]) {
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
                    $and: [{ _deleted: false }, { category_id: null }, filterQueryObj]
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
     * @api {delete} /v1/auth/admin/category/:categoryId delete category
     * @apiName deleteCategory
     * @apiGroup adminCategory
     *
     * @apiSuccess {Object} Category.
     */

    deleteCategory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('deleteCategory function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            if (!req.params.categoryId) {
                throw new Error('Please provide categoryId');
            }

            await CategoryModel.findOneAndUpdate(
                { _id: req.params.categoryId },
                {
                    _deleted: true
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Category successfully deleted'
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

export default new Category();
