import userApplicationRoute from './application/user/auth';
import adminRoute from './admin/admin/auth';
import categoryRoute from './admin/category/auth';
import categoryApplicationRoute from './application/category/auth';
import adminUserRoute from './admin/user/auth';
import adminReportRoute from './admin/report/auth';
import applicationReport from './application/report/auth';
import adminStaticPage from './admin/staticPage/auth';
import adminSearchHistory from './admin/searchHistory/auth';
import applicationSearchHistory from './application/searchHistory/auth';
import { Router } from 'express';
const router = Router();

/**
 * Total Auth Routes
 */
router.use('/user', userApplicationRoute);
router.use('/user', categoryApplicationRoute);
router.use('/admin', adminRoute);
router.use('/admin', adminUserRoute);
router.use('/admin', categoryRoute);
router.use('/admin', adminReportRoute);
router.use('/admin', adminStaticPage);
router.use('/admin', adminSearchHistory);
router.use('/user', applicationReport);
router.use('/user', applicationSearchHistory);

// router.use('/category', categoryRoute);

export default router;
