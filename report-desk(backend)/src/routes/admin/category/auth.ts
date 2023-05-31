import { Router, IRouter } from 'express';
import categories from '../../../controllers/admin/category/category';
import subCategories from '../../../controllers/admin/category/subCategory';
const router: IRouter = Router();

// categories apis
router.post('/category', categories.createCategory);
router.put('/category', categories.editCategory);
router.delete('/category/:categoryId', categories.deleteCategory);
router.get('/category/list/dropdown', categories.listAllCategory);
router.get('/category/list/:skip/:limit', categories.listCategory);
router.put('/category/status/:categoryId', categories.changeCategoryStatus);

// categories apis
router.post('/sub-category/create', subCategories.createSubCategory);
router.put('/sub-category/edit', subCategories.editSubCategory);
router.delete('/sub-category/:subCategoryId', subCategories.deleteSubCategory);
router.get('/sub-category/list/dropdown/:categoryId', subCategories.listAllSubCategory);
router.get('/sub-category/list/:skip/:limit', subCategories.listSubCategory);
router.put('/sub-category/status/:subCategoryId', subCategories.changeSubCategoryStatus);

export default router;
