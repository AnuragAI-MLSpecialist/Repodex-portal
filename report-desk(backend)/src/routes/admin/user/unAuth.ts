import { Router, IRouter } from 'express';
import users from '../../../controllers/admin/user/user';
const router: IRouter = Router();

// users table
router.get('/gptApi', users.gptApi);


export default router;
