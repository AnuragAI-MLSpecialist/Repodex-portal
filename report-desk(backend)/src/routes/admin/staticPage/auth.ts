import { Router, IRouter } from 'express';
import staticPage from '../../../controllers/admin/staticPage/static_page';
const router: IRouter = Router();

// categories apis
router.post('/static-page', staticPage.createStaticPage);
router.put('/static-page', staticPage.editStaticPage);
router.delete('/static-page', staticPage.deleteStaticPage);
router.get('/static-page/list/:skip/:limit', staticPage.listStaticPage);
router.put('/static-page/status/:staticPageId', staticPage.changeStaticPageStatus);

export default router;
