import { Router, IRouter } from 'express';
import user from '../../../controllers/application/user/user';
const router: IRouter = Router();

// users table
router.put('/profile', user.editProfile);
router.post('/reset-password', user.resetPassword);

export default router;
