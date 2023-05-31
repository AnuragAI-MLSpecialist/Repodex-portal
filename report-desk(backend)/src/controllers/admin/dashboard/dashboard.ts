import { logger } from '../../../utils/logger';
import { Request, Response } from 'express';
import { httpStatusCodes } from '../../../utils/constants';
import AdminController from '../../super/AdminController';
import { UserModel } from '../../../models/users';
import { ReportModel } from '../../../models/reports';
import { VisitHistoryModel } from '../../../models/visit_historys';
import { UserReportDownloadModel } from '../../../models/user_report_download';

class Dashboard extends AdminController {
    /**
     * @api {get} v1/auth/admin/kpi (Kpi for dashboard)
     * @apiName dashboardKpis
     * @apiGroup AdminDshboard
     *
     * @apiSuccess {Object} Admin.
     */
    dashboardKpis = async (req: Request, res: Response) => {
        logger.info('!!!!!!dashboardKpi function start!!!!!');
        try {
            const registeredUsersCount = await UserModel.count({
                _deleted: false
            });
            const reportCount = await ReportModel.count({
                _deleted: false
            });
            const downloadCount = await UserReportDownloadModel.count({
                _deleted: false
            });
            const viewCount = await VisitHistoryModel.count({
                _deleted: false
            });

            res.json({
                status: httpStatusCodes.SUCCESS_CODE,
                message: 'successfully fetched',
                data: {
                    registeredUsersCount,
                    reportCount,
                    downloadCount,
                    viewCount
                }
            });
        } catch (error: any) {
            logger.error(error);
            res.status(httpStatusCodes.SERVER_ERROR_CODE).json({
                status: httpStatusCodes.SERVER_ERROR_CODE,
                message: typeof error === 'string' ? error : typeof error.message === 'string' ? error.message : 500
            });

            return;
        }
    };
}

export default new Dashboard();
