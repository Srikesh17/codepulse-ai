import { dashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  async getOverview(req, res, next) {
    try {
      const data = await dashboardService.getOverview(req.user.id);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || '10', 10);
      const data = await dashboardService.getActivity(req.user.id, limit);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
