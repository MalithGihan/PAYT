import { Request, Response, NextFunction } from "express";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

export const getUserNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as string;

      const notifications = await NotificationModel.find({ userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, message } = req.body;

      const userId = req.user?._id as string; 

      const newNotification = await NotificationModel.create({
        userId,
        type,
        message,
      });

      res.status(201).json({
        success: true,
        notification: newNotification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = req.params.id;
      const { isRead, message } = req.body;

      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        { isRead, message },
        { new: true }
      );

      if (!updatedNotification) {
        return next(new ErrorHandler("Notification not found", 404));
      }

      res.status(200).json({
        success: true,
        notification: updatedNotification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = req.params.id;

      const deletedNotification = await NotificationModel.findByIdAndDelete(
        notificationId
      );

      if (!deletedNotification) {
        return next(new ErrorHandler("Notification not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
