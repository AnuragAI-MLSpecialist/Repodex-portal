import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { AdminDocument, AdminModel } from '../../../models/admins';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import AdminController from '../../super/AdminController';
import mailerService from '../../mailerService';
import bcrypt from 'bcrypt';

class Admin extends AdminController {
    /* 
        --------------------------------------------------------------------------------
        Admin functions 
    */

    /**
     * @api {post} v1/admin/login-admin Login Admin
     * @apiName loginAdmin
     * @apiGroup Admin
     *
     * @apiParam {string} email email of the admin.(required)
     * @apiParam {String} password password of the admin.(required)
     *
     *
     * @apiSuccess {Object} Admin.
     */
    loginAdmin = async (req: Request, res: Response) => {
        logger.info('!!!!!!loginAdmin function start!!!!!');
        try {
            /**
             * Check admin is already exist or not if exist then return the data
             * verify admin's email & password
             */

            const { email, password } = req.body;

            const existingAdmin = await super.verifyAdminLoginCredentials(email, password);

            if (!existingAdmin) {
                throw new Error('Please enter valid email & password');
            }

            const returnAdminData = await super.getAdminData(existingAdmin._id);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'successfully logged in',
                data: returnAdminData
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
    };

    /**
     * @api {post} v1/admin/sign-up Sign-up admin
     * @apiName createNewAdmin
     * @apiGroup Admin
     *
     * @apiParam {string} email email of the Admin.(required)
     * @apiParam {String} password password of the Admin.(required)
     *
     * @apiSuccess {Object} Admin.
     */

    createNewAdmin = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('createNewAdmin function started');
        try {
            const { email, password } = req.body;

            const foundAdmin = await AdminModel.findOne({ email });

            if (foundAdmin) {
                throw new Error('Admin already exist');
            }

            const createAdmin = await AdminModel.create({
                password,
                email
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Admin Successfully Created',
                adminData: createAdmin
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
     * @api {put} v1/auth/admin/profile Edit profile of Admin
     * @apiName editProfile
     * @apiGroup Admin
     *
     * @apiParam {string} email email of the admin.
     *
     * @apiSuccess {Object} Admin.
     */

    editProfile = async (req: Request, res: Response) => {
        logger.info('!!!!!!editProfile function start!!!!!');
        try {
            const updateObject: any = {};

            if (req.body.email) {
                updateObject.email = req.body.email;
            }

            await super.updateAdminData(req[`admin`].id, updateObject);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'successfully edited'
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
    };

    /**
     * @api {post} v1/admin/forgot-password forgot password od admin
     * @apiName forgotPassword
     * @apiGroup Admin
     *
     * @apiParam {string} email (required)
     *
     * @apiSuccess {Object} Admin.
     */

    forgotPassword = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('forgotPassword function started');
        try {
            if (!req.body.email) {
                throw new Error('Please provide a email');
            }

            const foundAdmin = await AdminModel.findOne({ email: req.body.email });

            if (!foundAdmin) {
                throw new Error('Please provide a valid email');
            }

            // get opt function
            const otp = super.getOtp();

            await AdminModel.findOneAndUpdate(
                { email: req.body.email },
                {
                    forgot_code: otp
                }
            );

            // send mail to registerd email for verify
            await mailerService.sendMail(res, req.body.email, 'Forgot Password', 'email/forgot_password', {
                otp
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully sended otp for forgot password'
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
     * @api {post} v1/admin/set-password For set new password
     * @apiName setPassword
     * @apiGroup Admin
     *
     * @apiParam {string} code (required)
     * @apiParam {string} password (required)
     *
     * @apiSuccess {Object} Admin.
     */
    1;
    setPassword = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('setPassword function started');
        try {
            if (!req.body.code || !req.body.password) {
                throw new Error('Please provide all required fields');
            }

            const foundAdmin = await AdminModel.findOne({ forgot_code: req.body.code });

            if (!foundAdmin) {
                throw new Error('Please provide a valid code');
            }

            const password = await bcrypt.hash(req.body.password, 8);

            await AdminModel.findOneAndUpdate(
                { forgot_code: req.body.code },
                {
                    password,
                    forgot_code: null
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully seted new password'
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
     * @api {post} v1/auth/admin/reset-password For reset password
     * @apiName resetPassword
     * @apiGroup Admin
     *
     * @apiParam {string} oldPassword (required)
     * @apiParam {string} newPassword (required)
     *
     * @apiSuccess {Object} Admin.
     */

    resetPassword = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('resetPassword function started');
        try {
            if (!req.body.oldPassword || !req.body.newPassword) {
                throw new Error('Please provide all required fields');
            }

            const foundAdmin = await AdminModel.findOne({ _id: req[`admin`].id });

            if (!foundAdmin) {
                throw new Error('Please provide a valid auth');
            }

            const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, foundAdmin.password);

            if (!isPasswordCorrect) {
                throw new Error('Please provide correct old password');
            }

            const password = await bcrypt.hash(req.body.newPassword, 8);

            await AdminModel.findOneAndUpdate(
                { _id: req[`admin`].id },
                {
                    password
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully reseted password'
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

export default new Admin();
