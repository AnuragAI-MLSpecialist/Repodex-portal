import { Router, IRouter } from 'express';
import report from '../../../controllers/admin/report/report';
const router: IRouter = Router();

// categories apis
router.post('/report', report.createReport);
router.put('/report', report.editReport);
router.delete('/report/:reportId', report.deleteReport);
router.get('/report/list/:skip/:limit', report.listReport);
router.put('/report/status/:report_id', report.changeReportStatus);

export default router;
