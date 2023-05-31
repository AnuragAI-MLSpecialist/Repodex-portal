import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { UserDocument, UserModel } from '../../../models/users';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import axios from "axios"
class User {
    /* 
        --------------------------------------------------------------------------------
        Admins functions 
    */

    /**
     * @api {get} /v1/auth/admin/user/list/:skip/:limit?search={(searchBy):(string)} (List All User)
     * @apiName listUsers
     * @apiGroup AdminUser
     *
     *
     * @apiSuccess {Object} User.
     */
    async listUsers(req: Request, res: Response) {
        logger.info('!!!!!!listUsers function start!!!!!');
        try {
            console.log("inside list users")
            const skipLimit: number = Number(req.params.skip) || 0;
            const limitNumber: number = Number(req.params.limit) || 10;

            // count page
            let page = 1;
            if (skipLimit > 0) {
                page = skipLimit / limitNumber + 1;
            }

            const { search } = req.query;

            /**
             * use filterQueryObj in find query
             */
            let filterQueryObj: any = {};

            /**
             * filter data by search query
             */
            if (typeof search === 'string') {
                const splittedSearch = search.split(':');
                if (splittedSearch.length === 2) {
                    const [searchBy, searchValue] = splittedSearch;
                    if (searchBy === 'search') {
                        /**
                         * for name
                         */

                        filterQueryObj = {
                            $or: [
                                {
                                    first_name: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    last_name: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    email: new RegExp(`${searchValue}`, 'i')
                                },
                                {
                                    phone: new RegExp(`${searchValue}`, 'i')
                                }
                            ]
                        };
                    }
                }
            }

            const userData: PaginationModel<UserDocument> | undefined = await UserModel.paginate({
                query: {
                    $and: [{ _deleted: false }, filterQueryObj]
                },
                page,
                limit: limitNumber,
                sort: { createdAt: -1 }
                // populate: "subjects.subject_id"
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'successfully listed users',
                userData
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
    }


    gptApi = async (req: Request, res: Response) => {
        try {
           const response = await axios.get("https://reportdesk.azurewebsites.net/alluser")
           console.log(response)

            res.json({
                status:200,
                data:response.data,
                message: 'gpt users'
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
     * @api {put} /v1/auth/admin/user/update_status/:user_id (change user status)
     * @apiName changeUserStatus
     * @apiGroup AdminUser
     *
     * @apiParam {String} flag flag of the user(true/false).
     *
     * @apiSuccess {Object} Object .
     */
    changeUserStatus = async (req: Request, res: Response) => {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Provide at least one parameter in body');
            }

            const { flag } = req.body;

            const foundUser = await UserModel.findOne({ _id: req.params.user_id });

            if (!foundUser) {
                throw new Error('User not found');
            }

            if (foundUser._deleted) {
                throw new Error('This user has been deleted');
            }

            await UserModel.findOneAndUpdate({ _id: req.params.user_id }, { is_active: flag });

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
     * @api {delete} /v1/auth/admin/user/delete/:user_id (delete user)
     * @apiName deleteUser
     * @apiGroup AdminUser
     *
     *
     * @apiSuccess {Object} Object .
     */
    deleteUser = async (req: Request, res: Response) => {
        try {
            const foundUser = await UserModel.findOne({ _id: req.params.user_id });
            logger.info(`!!!!!UserId:::::: ${req.params.user_id}!!!!!!!`);

            if (!foundUser) {
                throw new Error('User not found');
            }

            if (foundUser._deleted) {
                throw new Error('This user has been deleted');
            }

            await UserModel.findOneAndUpdate({ _id: req.params.user_id }, { _deleted: true });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully deleted user'
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });
        }
    };
}

export default new User();
