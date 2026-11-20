import { userService } from '../services/user.service.js';

export class UserController {
  async getProfile(req, res, next) {
    try {
      const data = await userService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const data = await userService.updateProfile(req.user.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
