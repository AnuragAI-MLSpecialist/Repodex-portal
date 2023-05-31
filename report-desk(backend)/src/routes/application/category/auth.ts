import { Router, IRouter } from 'express';
import category from '../../../controllers/application/category/category';
import subCategory from '../../../controllers/application/category/subCategory';
const router: IRouter = Router();

// category table
router.get('/category/list/:skip/:limit', category.listCategory);
router.get('/sub-category/list/:skip/:limit', subCategory.listSubCategory);
router.get('/sub-category/list-by-category/:category_id', subCategory.listSubCategoryByCategoryId);

export default router;
