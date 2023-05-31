import { logger } from '../../../utils/logger';
// import models from '../../models/index';
import { UserDocument, UserModel } from '../../../models/users';
import { ReportModel } from '../../../models/reports';
import { UserReportDownloadModel } from '../../../models/user_report_download';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import { PaginationModel } from 'mongoose-paginate-ts';
import UserAppController from '../../super/UserAppController';
import mailerService from '../../mailerService';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

class User extends UserAppController {
    /* 
        --------------------------------------------------------------------------------
        Application functions 
    */
    scriptFunction = async (req: Request, res: Response) => {
        try {
            const reportData = await ReportModel.find({});
            logger.info(`!!Report Data Length!!!! ${reportData.length}`);

            for (const reportItem of reportData) {
                try {
                    const region = reportItem.region;
                    const country = reportItem.country;
                    logger.info(`!!!country for ${reportItem._id}!!!! ${region} and ${country}`);

                    await ReportModel.findOneAndUpdate(
                        { _id: reportItem._id },
                        {
                            countries: [
                                {
                                    country
                                }
                            ],
                            regions: [
                                {
                                    region
                                }
                            ]
                        }
                    );
                } catch (e) {
                    logger.error(`!!!Error for ${reportItem._id}!!!!! ${e}`);
                }
            }

            const reportDownloadData = await UserReportDownloadModel.find({});
            logger.info(`!!Report Download Data Length!!!! ${reportDownloadData.length}`);

            for (const reportDownloadItem of reportDownloadData) {
                try {
                    const reportId = reportDownloadItem.report_id;
                    logger.info(`!!!report id for ${reportDownloadItem._id}!!!!!!!!!! ${reportId}`);
                    const reportFindData = await ReportModel.findOne({
                        _id: super.toObjectId(String(reportId))
                    });
                    logger.info(`!!!reportFindData!!!!!!!!!! ${reportFindData && reportFindData._id}!!!!!!!!!`);

                    if (reportFindData) {
                        await ReportModel.findOneAndUpdate(
                            { _id: reportDownloadItem._id },
                            {
                                countries: reportFindData.countries,
                                regions: reportFindData.regions,
                                type: reportFindData.type
                            }
                        );
                    }
                } catch (e) {
                    logger.error(`!!!Error for ${reportDownloadItem._id}!!!!! ${e}`);
                }
            }

            res.status(200).json({
                status: 200
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
     * @api {post} v1/user/login-user Login User
     * @apiName loginUser
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} email email of the user.(required)
     * @apiParam {String} password password of the user.(required)
     *
     *
     * @apiSuccess {Object} User.
     */
    loginUser = async (req: Request, res: Response) => {
        logger.info('!!!!!!loginUser function start!!!!!');
        try {
            /**
             * Check user is already exist or not if exist then return the data
             * verify user's email & password
             */

            const { email, password } = req.body;

            logger.info('user found ....');

            const existingUser = await super.verifyUserLoginCredentials(email, password);

            if (!existingUser) {
                throw new Error('Please enter valid email & password');
            }

            const returnUserData = await super.getUserData(existingUser._id);

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'successfully logged in',
                data: returnUserData
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
     * @api {post} v1/user/sign-up Sign-up User
     * @apiName createNewUser
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} first_name first_name of the user.(required)
     * @apiParam {string} last_name last_name of the user.
     * @apiParam {string} company_name company_name of the user.
     * @apiParam {string} phone phone of the user.
     * @apiParam {string} email email of the user.(required)
     * @apiParam {String} password password of the user.(required)
     * @apiParam {String} country country of the user.(required)
     *
     * @apiSuccess {Object} User.
     */

    createNewUser = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('create user function started');
        try {
            const { first_name, last_name, company_name, phone, email, password, country } = req.body;

            const foundUser = await UserModel.findOne({ email });

            if (foundUser) {
                throw new Error('User already exist');
            }

            // get opt function
            const otp = super.getOtp();
            const createdUser = await UserModel.create({
                first_name,
                last_name,
                company_name,
                phone,
                password,
                country,
                email,
                verify_code: otp
            });

            const verificationLink = `${process.env.APP_URL}verify-email/${createdUser.id}`;
            // send mail to registered email for verify
            await mailerService.sendMail(res, email, 'Verify Email', 'email/verify_email', {
                otp,
                verificationLink,
                name: `${first_name} ${last_name}`
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'User Successfully Created'
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
     * @api {post} v1/user/verify-email verify-email
     * @apiName verifyEmail
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} userId (required)
     *
     * @apiSuccess {Object} User.
     */
    verifyEmail = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('verifyEmail function started');
        try {
            if (!req.body.userId) {
                throw new Error('Please provide a userId');
            }

            const foundUser = await UserModel.findOne({ _id: req.body.userId });

            if (!foundUser) {
                throw new Error('Please provide a valid userId');
            }

            await UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                {
                    is_email_verified: true,
                    verify_code: null,
                    verify_created_at: new Date()
                }
            );

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'User Account Successfully Verified'
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
     * @api {put} v1/auth/user/profile Edit profile of User
     * @apiName editProfile
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} first_name first_name of the user.
     * @apiParam {string} last_name last_name of the user.
     * @apiParam {string} company_name company_name of the user.
     * @apiParam {string} phone phone of the user.
     * @apiParam {string} email email of the user.
     * @apiParam {String} country country of the user.
     *
     * @apiSuccess {Object} User.
     */

    editProfile = async (req: Request, res: Response) => {
        logger.info('!!!!!!editProfile function start!!!!!');
        try {
            const updateObject: any = {};

            if (req.body.first_name) {
                updateObject.first_name = req.body.first_name;
            }

            if (req.body.last_name) {
                updateObject.last_name = req.body.last_name;
            }

            if (req.body.phone) {
                updateObject.phone = req.body.phone;
            }

            if (req.body.email) {
                updateObject.email = req.body.email;
            }

            if (req.body.company_name) {
                updateObject.company_name = req.body.company_name;
            }

            if (req.body.country) {
                updateObject.country = req.body.country;
            }

            logger.info('!!!!!!User updateObject!!!!!');
            logger.info(JSON.stringify(updateObject, null, 2));

            await super.updateUserData(req[`user`].id, updateObject);

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
     * @api {post} v1/user/forgot-password forgotpassword
     * @apiName forgotPassword
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} email (required)
     *
     * @apiSuccess {Object} User.
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

            const foundUser = await UserModel.findOne({ email: req.body.email });

            if (!foundUser) {
                throw new Error('Please provide a valid email');
            }

            // get opt function
            const otp = super.getOtp();
            const verificationLink = `${process.env.APP_URL}reset-password/${otp}`;

            await UserModel.findOneAndUpdate(
                { email: req.body.email },
                {
                    forgot_code: otp
                }
            );

            // send mail to registerd email for verify
            await mailerService.sendMail(res, req.body.email, 'Forgot Password', 'email/forgot_password', {
                otp,
                verificationLink
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
     * @api {post} v1/user/set-password For set new password
     * @apiName setPassword
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} code (required)
     * @apiParam {string} password (required)
     *
     * @apiSuccess {Object} User.
     */

    setPassword = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('setPassword function started');
        try {
            if (!req.body.code || !req.body.password) {
                throw new Error('Please provide all required fields');
            }

            const foundUser = await UserModel.findOne({ forgot_code: req.body.code });

            if (!foundUser) {
                throw new Error('Please provide a valid code');
            }

            const password = await bcrypt.hash(req.body.password, 8);

            await UserModel.findOneAndUpdate(
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
     * @api {post} v1/auth/user/reset-password For reset password
     * @apiName resetPassword
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} oldPassword (required)
     * @apiParam {string} newPassword (required)
     *
     * @apiSuccess {Object} User.
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

            const foundUser = await UserModel.findOne({ _id: req[`user`].id });

            if (!foundUser) {
                throw new Error('Please provide a valid auth');
            }

            const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, foundUser.password);

            if (!isPasswordCorrect) {
                throw new Error('Please provide correct old Password');
            }

            const password = await bcrypt.hash(req.body.newPassword, 8);

            await UserModel.findOneAndUpdate(
                { _id: req[`user`].id },
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

    /**
     * @api {post} v1/user/send-mail (Send custom Mail)
     * @apiName sendCustomMail
     * @apiGroup ApplicationUser
     *
     * @apiParam {string} email (required)
     * @apiParam {string} first_name (required)
     * @apiParam {string} last_name (required)
     * @apiParam {string} subject (required)
     * @apiParam {string} phone_number (required)
     * @apiParam {string} request_message (optional)
     *
     * @apiSuccess {Object} User.
     */

    sendCustomMail = async (req: Request, res: Response) => {
        /**
         * validate body
         */
        logger.info('sendCustomMail function started');
        try {
            if (
                !req.body.email ||
                !req.body.first_name ||
                !req.body.last_name ||
                !req.body.subject ||
                !req.body.phone_number
            ) {
                throw new Error('Please provide valid data');
            }

            const clientMailId = process.env.CLIENT_MAIL_ID || 'marketandresearch99@gmail.com';
            logger.info(`clientMailId: ${clientMailId}`);
            await mailerService.sendMail(res, clientMailId, req.body.subject, 'email/custom_mail_client', {
                name: `${req.body.first_name} ${req.body.last_name}`,
                message: req.body.request_message,
                phone: req.body.phone_number,
                email: req.body.email
            });

            // send mail to registerd email for verify
            await mailerService.sendMail(res, req.body.email, req.body.subject, 'email/custom_mail', {
                name: `${req.body.first_name} ${req.body.last_name}`,
                message: req.body.request_message,
                phone: req.body.phone_number,
                email: req.body.email
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'Successfully sended mail'
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

export default new User();
