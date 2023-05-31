import { Router, IRouter } from 'express';
import staticPage from '../../../controllers/application/staticPage/staticPage';
const router: IRouter = Router();

router.get('/static-page/list/:skip/:limit', staticPage.listStaticPage);

export default router;
