import { ObjectId, Types } from 'mongoose';
import { nanoid } from 'nanoid';

class AppController {
    constructor() {
        // super();
    }

    // to convert string id to object id
    toObjectId(id: string) {
        return new Types.ObjectId(id);
    }

    // check given id is object id or not
    isObjectId(id: string) {
        try {
            const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
            return checkForHexRegExp.test(id.toString());
        } catch (error) {
            return false;
        }
    }

    /**
     * @param length optional default is 10
     * @returns string
     */
    generateUniqueIDs = async (length: number = 10) => nanoid(length);

    // provide random Otp of 4 digit
    getOtp() {
        // Declare a digits variable
        // which stores all digits
        const digits = '0123456789';
        let OTP = '';

        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
}

export default AppController;
