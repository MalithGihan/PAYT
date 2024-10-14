import { Request, Response, NextFunction } from "express";
import RequestCollectModel from "../models/RequestCollect";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// Create a new request
export const createRequestController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { message, binId,userId } = req.body;  

  const newRequest = await RequestCollectModel.create({ userId, binId, message });
  
  res.status(201).json({
    success: true,
    request: newRequest,
  });
});

// Get all requests
export const getRequestsController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const requests = await RequestCollectModel.find({}); 
  
  res.status(200).json({
    success: true,
    requests,
  });
});

// Update a request by ID
export const updateRequestController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { requestId } = req.params;
  const updates = req.body; 

  const updatedRequest = await RequestCollectModel.findByIdAndUpdate(requestId, updates, { new: true });

  if (!updatedRequest) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(200).json({
    success: true,
    request: updatedRequest,
  });
});

// Delete a request by ID
export const deleteRequestController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { requestId } = req.params;

  const deletedRequest = await RequestCollectModel.findByIdAndDelete(requestId);

  if (!deletedRequest) {
    return next(new ErrorHandler("Request not found", 404));
  }

  res.status(204).json({
    success: true,
    message: "Request deleted successfully",
  });
});
