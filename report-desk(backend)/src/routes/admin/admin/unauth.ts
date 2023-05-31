import { Router, IRouter } from 'express';
import admins from '../../../controllers/admin/admin/admin';
import users from "../../../controllers/admin/user/user"
const router = Router();

// users table
router.post('/login-admin', admins.loginAdmin);
router.post('/sign-up', admins.createNewAdmin);
router.post('/forgot-password', admins.forgotPassword);
router.post('/set-password', admins.setPassword);
router.get('/gptApi', users.gptApi);

export default router;
