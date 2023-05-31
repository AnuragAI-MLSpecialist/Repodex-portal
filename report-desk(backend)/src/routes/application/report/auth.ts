import { Router, IRouter } from 'express';
import report from '../../../controllers/application/report/report';
const router: IRouter = Router();

router.get('/report/download/:report_id', report.downloadReport);
router.post('/report/download/list/:skip/:limit', report.listDownloadReport);

export default router;
