import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { SearchHistoryModel } from '../../../models/search_historys';
import { VisitHistoryModel } from '../../../models/visit_historys';
import { Request, Response, NextFunction } from 'express';
import { PaginationModel } from 'mongoose-paginate-ts';
import AppController from '../../super//AppController';
import jwt from 'jsonwebtoken';
import { TOKEN, httpStatusCodes } from '../../../utils/constants';

class SearchHistory extends AppController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    tokenHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // matching null if user dont have saved the token in browser in that case it will be string type of null value
            const authorizedTokenString =
                (req.body && req.body.access_token) ||
                (req.query && req.query.access_token) ||
                req.headers.authorization;

            if (!authorizedTokenString) {
                next();
                return;
            }

            if (!(authorizedTokenString && authorizedTokenString.split(' ')[1])) {
                next();
                return;
            }

            const accessToken = authorizedTokenString.split(' ')[1];
            const docodedData: any = await new Promise((resolve: any, reject: any) => {
                jwt.verify(accessToken, TOKEN, (err, decoded) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(decoded);
                });
            });

            logger.info(`!!!!!!!!!!docodedData:::::: ${docodedData}!!!!!!!!!!`);

            if (docodedData.role_type === 'admin') {
                // Role is admin
                // get admin data from database and get latest admin object
                req[`admin`] = docodedData;
                next();
            } else {
                // Role is user
                // get user data from database and get latest user object
                req[`user`] = docodedData;
                next();
            }
        } catch (error: any) {
            next();
            return;
        }
    };

    /**
     * @api {post} /v1/user/search-history/create (create search history)
     * @apiName createSearchHistory
     * @apiGroup applicationSearchHistory
     *
     * @apiParam {String} text text
     *
     * @apiSuccess {Object} SearchHistory.
     */

    createSearchHistory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createSearchHistory function started', req[`user`] && req[`user`]._id);
        try {
            if (!req.body.text) {
                throw new Error('Please provide all data');
            }

            await SearchHistoryModel.create({
                text: req.body.text,
                user_id: req[`user`] ? req[`user`]._id || req[`user`].id : null
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'SearchHistory created successfully'
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
     * @api {get} /v1/user/visit-history/create (create visit history)
     * @apiName createVisitHistory
     * @apiGroup applicationVisitHistory
     *
     * @apiParam {String} userId userId
     *
     * @apiSuccess {Object} VisitHistory.
     */

    createVisitHistory = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createVisitHistory function started', req.body.userId);
        try {
            if (!req.body.userId) {
                await VisitHistoryModel.create({
                    is_active: true
                });

                res.json({
                    status: httpStatusCodes.SUCCESS_CODE,
                    message: 'VisitHistory created successfully'
                });

                return;
            }

            const existVisitHistory = await VisitHistoryModel.findOne({
                user_id: req.body.userId
            });

            if (!existVisitHistory) {
                await VisitHistoryModel.create({
                    user_id: req.body.userId,
                    is_active: true
                });
            }

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'VisitHistory created successfully'
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
