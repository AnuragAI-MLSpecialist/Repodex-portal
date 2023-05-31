import { Router, IRouter } from 'express';
import users from '../../../controllers/admin/user/user';
const router: IRouter = Router();

// users table
router.get('/user/list/:skip/:limit', users.listUsers);
router.put('/user/update_status/:user_id', users.changeUserStatus);
router.delete('/user/delete/:user_id', users.deleteUser);

export default router;
