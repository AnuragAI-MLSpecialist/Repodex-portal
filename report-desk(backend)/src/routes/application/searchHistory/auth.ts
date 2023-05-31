import { Router, IRouter } from 'express';
import searchHistory from '../../../controllers/application/searchHistory/search_history';
const router: IRouter = Router();

router.get('/visit-history/create', searchHistory.createVisitHistory);

export default router;
