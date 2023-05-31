import { Router, IRouter } from 'express';
import searchHistory from '../../../controllers/admin/searchHistory/search_history';
const router: IRouter = Router();

// categories apis
router.get('/search-history/list/:skip/:limit', searchHistory.listSearchHistory);

export default router;
