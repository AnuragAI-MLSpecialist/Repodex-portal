import { Router, IRouter } from 'express';
import admins from '../../../controllers/admin/admin/admin';
import dashboard from '../../../controllers/admin/dashboard/dashboard';

const router: IRouter = Router();

// admins table
router.put('/profile', admins.editProfile);
router.post('/reset-password', admins.resetPassword);

// Dashboard
router.get('/kpi', dashboard.dashboardKpis);

export default router;
