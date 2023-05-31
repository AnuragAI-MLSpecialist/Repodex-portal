import { Router, IRouter } from 'express';
import category from '../../../controllers/application/category/category';
import subCategory from '../../../controllers/application/category/subCategory';

const router: IRouter = Router();

// category table
router.get('/category/list/dropdown', category.listAllCategory);
router.get('/sub-category/list/dropdown/:categoryId', subCategory.listAllSubCategory);
router.get('/home/category/list/:skip/:limit', category.listHomeCategory);
router.get('/home/category/top/list/:skip/:limit', category.listHomeTopCategory);
router.get('/home/report/top/list/:skip/:limit', category.listHomeTopReport);

export default router;
