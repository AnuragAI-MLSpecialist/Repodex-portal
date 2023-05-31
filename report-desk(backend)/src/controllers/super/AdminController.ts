import AppController from './AppController';
import { AdminDocument, AdminModel } from '../../models/admins';
import { TOKEN } from '../../utils/constants';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';

class AdminAppController extends AppController {
    constructor() {
        super();
    }

    // This function is used for verify email and password of admin
    async verifyAdminLoginCredentials(email: string, password: string) {
        if (!email || !password) {
            throw new Error('email & password required for admin login');
        }

        const foundAdmin = await AdminModel.findOne({ _deleted: false, email });

        if (!foundAdmin) {
            logger.info('email is wrong');
            throw new Error('Please enter valid email');
        }

        const isPasswordCorrect = await bcrypt.compare(password, foundAdmin.password);

        if (!isPasswordCorrect) {
            logger.info('password is wrong');
            throw new Error('Please enter valid password');
        }

        return foundAdmin;
    }

    // This function is used for fatch admin data by given id
    async getAdminData(id: string) {
        try {
            const adminData = await AdminModel.findOne({
                _deleted: false,
                is_active: true,
                _id: super.toObjectId(id)
            }).lean();

            let authToken;
            if (adminData) {
                const secret = TOKEN;
                authToken = jwt.sign({ id, role_type: 'admin' }, secret, {
                    expiresIn: 60 * 60 * 24 * 365 // expires in 1 year
                });
            }

            return { ...adminData, authToken };
        } catch (e) {
            throw e;
        }
    }

    // This function id used for update admin data by given update object
    async updateAdminData(id: string, updateObject: any) {
        try {
            return await AdminModel.findOneAndUpdate({ _id: id }, updateObject);
        } catch (e) {
            throw e;
        }
    }
}

export default AdminAppController;
