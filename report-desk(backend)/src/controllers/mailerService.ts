import dotenv from 'dotenv';
import { logger } from '../utils/logger';
dotenv.config();
// const ID = process.env.AWS_ID;
// const SECRET = process.env.AWS_SECRET;
// const senderName = process.env.MAIL_SENDER;
// var ses = require('node-ses');
// var client = ses.createClient({ key: ID, secret: SECRET });

class MailerService {
    sendMail(res: any, toName: string, subject: string, templateName: string, payloadData: any) {
        try {
            logger.info(
                `!!!!!!!!initial data sendMail:::::::::: ${toName} and ${subject} and ${templateName} and ${payloadData}!!!!!!!!!`
            );
            return new Promise((resolve, reject) => {
                res.mailer.send(
                    templateName,
                    {
                        to: toName, // This can be a comma delimited string just like a normal email to field.
                        subject,
                        payloadData // All additional properties are also passed to the template as local variables.
                    },
                    async (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(true);
                    }
                );
            });
        } catch (e) {
            throw e;
        }
    }
}

export default new MailerService();
