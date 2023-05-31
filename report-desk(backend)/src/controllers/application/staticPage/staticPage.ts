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
        Application functions 
    */

    /**
     * @api {get} /v1/user/static-page/list/:skip/:limit?search={(searchBy):(string)} get static page list
     * @apiName listStaticPage
     * @apiGroup applicationStaticPage
     *
     * @apiSuccess {Object} StaticPage.
     */

    listStaticPage = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listStaticPage function started');
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
                    $and: [{ _deleted: false }, { is_active: true }, filterQueryObj]
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
}

export default new StaticPage();
