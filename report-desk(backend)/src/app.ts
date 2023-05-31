import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import json2xls from 'json2xls';
import apiV1UnAuthRoutes from './routes/unAuthRoute';
import apiV1AuthRoutes from './routes/authRoute';
import { logger, accessSuccessLogger, accessErrorLogger } from './utils/logger';
import { tokenHandler } from './middlewares';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import mailer from 'express-mailer';
import { httpStatusCodes } from './utils/constants';
import userUploadHandler from './controllers/UserUpload';

const upload = multer();
const UPLOAD_DIR_APIDOC = './dist/public/apidoc';

const app = express();

// register loggers
app.use(accessSuccessLogger);
app.use(accessErrorLogger);
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('./public')));

app.disable('x-powered-by');
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(json2xls.middleware);
app.set('view engine', 'ejs');

// SMTP setting
mailer.extend(app, {
    from: process.env.MAIL_SENDER,
    host: process.env.MAIL_HOST, // hostname
    secureConnection: process.env.MAIL_SECURE_CONNECTION, // use SSL
    port: process.env.MAIL_PORT, // port for secure SMTP
    transportMethod: process.env.MAIL_TRANSPORT_METHOD, // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// development
mongoose.connect(process.env.MONGO_DB || 'mongodb://18.237.13.3:28000/report_desk', {}, () => {
    logger.info('Mongo Connected ....');
});
app.use(cors())

// app.use(
//     cors({
//         credentials: true,
//         origin: [
//             'http://localhost:3000',
//             'http://173.249.10.82:4036',
//             'http://173.249.10.82:4035',
//             'https://admin.thereportdesk.com',
//             'https://thereportdesk.com'
//         ],
//         methods: ['GET', 'POST', 'PUT', 'DELETE']
//     })
// );
app.use(cookieParser('CookieSecret'));

// app.all('/*', (req, res, next) => {
//     // 	// CORS headers
//     res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     // Set custom headers for CORS
//     res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization,Client-Key');

//     if (req.method === 'OPTIONS') {
//         res.status(httpStatusCodes.SUCCESS_CODE).end();
//     } else {
//         next();
//     }
// });

app.use('/apidoc', express.static(UPLOAD_DIR_APIDOC));

app.use('/file/upload', userUploadHandler);

// parse FormData
app.use(upload.array());

app.use('/api/v1', apiV1UnAuthRoutes);
app.use('/api/v1/auth', tokenHandler, apiV1AuthRoutes);

// global error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json('Ouch! Something broke!');
    next();
});

export = app;

// TODO:
/**
 *  Add Mail Service
 *  Add Redis Queue
 *  Add Push Notification service
 */
