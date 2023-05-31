import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { SearchHistoryModel } from '../../../models/search_historys';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';

class SearchHistory extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {get} /v1/auth/admin/search-history/list/:skip/:limit?search={(searchBy):(string)} (get search history list)
     * @apiName listSearchHistory
     * @apiGroup adminSearchHistory
     *
     * @apiSuccess {Object} SearchHistory.
     */

    listSearchHistory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('listSearchHistory function started');
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

                        filterQueryObj.text = new RegExp(`${searchValue}`, 'i');
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

            const listSearchHistory = await SearchHistoryModel.paginate({
                query: {
                    $and: [{ _deleted: false }, filterQueryObj]
                },
                limit,
                page,
                sort: { createdAt: -1 },
                populate: ['user_id']
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'SearchHistory successfully listed',
                searchHistoryList: listSearchHistory
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

export default new SearchHistory();
