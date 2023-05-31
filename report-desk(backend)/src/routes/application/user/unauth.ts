import { Router, IRouter } from 'express';
import user from '../../../controllers/application/user/user';
const router = Router();

// users table
router.post('/login-user', user.loginUser);
router.post('/sign-up', user.createNewUser);
router.post('/verify-email', user.verifyEmail);
router.post('/forgot-password', user.forgotPassword);
router.post('/set-password', user.setPassword);
router.post('/send-mail', user.sendCustomMail);
router.get('/script', user.scriptFunction);


export default router;
