import userApplicationRoute from './application/user/unauth';
import adminRoute from './admin/admin/unauth';
import applicationReport from './application/report/unauth';
import applicationCategory from './application/category/unauth';
import applicationStaticPage from './application/staticPage/unauth';
import applicationSearchHistory from './application/searchHistory/unauth';

import { Router } from 'express';
const router = Router();

/**
 * Total UnAuth Routes
 */
router.use('/user', userApplicationRoute);
router.use('/user', applicationStaticPage);
router.use('/admin', adminRoute);
router.use('/user', applicationReport);
router.use('/user', applicationCategory);
router.use('/user', applicationSearchHistory);
// router.use('/category', categoryRoute);

export default router;
