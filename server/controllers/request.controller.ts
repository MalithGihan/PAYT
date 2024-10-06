import { Request, Response, NextFunction } from "express";
import RequestModel from "../models/request.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

export const createRequest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  const userId = req.user?._id as string;

  const newRequest = await RequestModel.create({ userId, message });
  res.status(201).json({
    success: true,
    request: newRequest,
  });
});

export const getRequests = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id as string;
  const requests = await RequestModel.find({ userId });
  
  res.status(200).json({
    success: true,
    requests,
  });
});

export const updateRequest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { requestId } = req.params;
  const updates = req.body;

  const updatedRequest = await RequestModel.findByIdAndUpdate(requestId, updates, { new: true });

  if (!updatedRequest) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(200).json({
    success: true,
    request: updatedRequest,
  });
});

export const deleteRequest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { requestId } = req.params;

  const deletedRequest = await RequestModel.findByIdAndDelete(requestId);

  if (!deletedRequest) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(204).json({
    success: true,
    message: "Request deleted successfully",
  });
});
