import { Router, IRouter } from 'express';
import report from '../../../controllers/application/report/report';
const router: IRouter = Router();

router.get('/report/pdf/home/list', report.listPdfReportHome);
router.get('/report/all/home/list', report.listAllReportHome);
router.post('/report/all/similar/list/:skip/:limit', report.listAllSimilarReports);
router.post('/report/list/:skip/:limit', report.listReport);
router.get('/report/:report_id', report.getReportById);

export default router;
