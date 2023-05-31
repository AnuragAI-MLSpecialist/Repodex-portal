import AppController from './AppController';
import { UserDocument, UserModel } from '../../models/users';
import { TOKEN } from '../../utils/constants';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';

class UserAppController extends AppController {
    constructor() {
        super();
    }

    // This function is used for verify email and password of user
    async verifyUserLoginCredentials(email: string, password: string) {
        if (!email || !password) {
            throw new Error('email & password required for user login');
        }

        const foundUser = await UserModel.findOne({
            _deleted: false,
            email,
            is_verified: true,
            // is_email_verified: true,
            is_active: true
        });

        if (!foundUser) {
            logger.info('email is wrong');
            throw new Error('Please enter valid email');
        }

        if (!foundUser.is_email_verified) {
            logger.info('email is not verified');
            throw new Error('Please verify your email');
        }

        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordCorrect) {
            logger.info('password is wrong');
            throw new Error('Please enter valid password');
        }

        return foundUser;
    }

    // This function is used for fatch admin data by given id
    async getUserData(id: string) {
        try {
            const userData = await UserModel.findOne({
                _deleted: false,
                is_active: true,
                _id: super.toObjectId(id)
            }).lean();

            let authToken;
            if (userData) {
                const secret = TOKEN;
                authToken = jwt.sign({ id, role_type: 'user' }, secret, {
                    expiresIn: 60 * 60 * 24 * 365 // expires in 1 year
                });
            }

            return { ...userData, authToken };
        } catch (e) {
            throw e;
        }
    }

    // This function id used for update admin data by given update object
    async updateUserData(id: string, updateObject: any) {
        try {
            return await UserModel.findOneAndUpdate({ _id: id }, updateObject);
        } catch (e) {
            throw e;
        }
    }
}

export default UserAppController;
