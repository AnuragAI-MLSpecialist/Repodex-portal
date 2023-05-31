import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { StaticPagesModel } from '../../../models/static_pages';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';
import mailerService from '../../mailerService';
import bcrypt from 'bcrypt';

class StaticPage extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {put} v1/auth/admin/static-page/status/:staticPageId (change static page status)
     * @apiName changeStaticPageStatus
     * @apiGroup adminStaticPage
     *
     * @apiParam {String} flag flag(true/false).
     *
     * @apiSuccess {Object} StaticPage .
     */
    changeStaticPageStatus = async (req: Request, res: Response) => {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Provide at least one parameter in body');
            }

            const { flag } = req.body;

            const foundStaticPage = await StaticPagesModel.findOne({ _id: req.params.staticPageId });

            if (!foundStaticPage) {
                throw new Error('Static page not found');
            }

            if (foundStaticPage._deleted) {
                throw new Error('This Static page has been deleted');
            }

            await StaticPagesModel.findOneAndUpdate({ _id: req.params.staticPageId }, { is_active: flag });

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
     * @api {post} /v1/auth/admin/static-page create static page
     * @apiName createStaticPage
     * @apiGroup adminStaticPage
     *
     * @apiParam {String} name name of the StaticPage.(required)
     * @apiParam {String} description description of the StaticPage.
     * @apiParam {Boolean} is_active status of StaticPage(true|false).
     *
     * @apiSuccess {Object} StaticPage.
     */

    createStaticPage = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createStaticPage function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            const { name, description, is_active } = req.body;

            if (!name) {
                throw new Error('Please provide a name');
            }

            const foundStaticPage = await StaticPagesModel.findOne({ name });

            if (foundStaticPage) {
                throw new Error('StaticPage already exist');
            }

            const createStaticPage = await StaticPagesModel.create({
                name,
                description,
                is_active
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'static page successfully Created',
                adminData: createStaticPage
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
     * @api {put} /v1/auth/admin/static-page edit static pages
     * @apiName editStaticPage
     * @apiGroup adminStaticPage
     *
     * @apiParam {string} id id of the StaticPage.(required)
     * @apiParam {string} name name of the StaticPage.
     * @apiParam {String} description description of the StaticPage.
     *
     * @apiSuccess {Object} StaticPage.
     */

    editStaticPage = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('editStaticPage function started');
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
                const staticPage = await StaticPagesModel.findOne({
                    $and: [{ name }, { _id: { $ne: id } }, { _deleted: false }]
                });

                if (staticPage) {
                    throw new Error('staticPage with this name already exists');
                }

                updateObject.name = name;
            }

            if (description) {
                updateObject.description = description;
            }

            await StaticPagesModel.findOneAndUpdate({ _id: id }, updateObject);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'staticPage successfully edited'
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
     * @api {get} /v1/auth/admin/static-page/list/:skip/:limit?search={(searchBy):(string)} get static page list
     * @apiName listStaticPage
     * @apiGroup adminStaticPage
     *
     * @apiSuccess {Object} StaticPage.
     */

    listStaticPage = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listStaticPage function started');
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

            const listStaticPage = await StaticPagesModel.paginate({
                query: {
                    $and: [{ _deleted: false }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 }
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'StaticPage successfully listed',
                staticPageList: listStaticPage
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
     * @api {delete} /v1/auth/admin/static-page delete static page
     * @apiName deleteStaticPage
     * @apiGroup adminStaticPage
     *
     * @apiParam {string} id id of the staticPage.(required)
     *
     * @apiSuccess {Object} staticPage.
     */

    deleteStaticPage = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('deleteStaticPage function started');
        try {
            if (!req[`admin`]) {
                throw new Error('Please login again');
            }

            if (!req.body.id) {
                throw new Error('Please provide id');
            }
            await StaticPagesModel.findOneAndUpdate(
                { _id: req.body.id },
                {
                    _deleted: true
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'StaticPage successfully deleted'
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

export default new StaticPage();
