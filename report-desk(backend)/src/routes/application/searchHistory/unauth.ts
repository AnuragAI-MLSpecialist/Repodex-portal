import { Router, IRouter } from 'express';
import searchHistory from '../../../controllers/application/searchHistory/search_history';
const router: IRouter = Router();

router.post('/search-history/create', searchHistory.tokenHandler, searchHistory.createSearchHistory);
router.post('/visit-history/create', searchHistory.createVisitHistory);

export default router;
