import { Request, Response, NextFunction } from "express";
import ComplaintModel from "../models/complaint.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// create garbage collection request
export const createComplaint = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  const userId = req.user?._id as string;

  const newComplaint = await ComplaintModel.create({ userId, message });
  res.status(201).json({
    success: true,
    complaint: newComplaint,
  });
});

// get garbage collection request
export const getComplaints = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const complaints = await ComplaintModel.find({ userId });

  res.status(200).json({
    success: true,
    complaints,
  });
});

// get all garbage collection request
export const getAllComplaints = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

  const complaints = await ComplaintModel.find({}).populate('userId', 'name role');

  res.status(200).json({
    success: true,
    complaints,
  });
});

// update garbage collection request
export const updateComplaint = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { complaintId } = req.params;
  const updates = req.body;

  const updatedComplaint = await ComplaintModel.findByIdAndUpdate(complaintId, updates, { new: true });

  if (!updatedComplaint) {
    return next(new ErrorHandler("Complaint not found", 404));
  }

  res.status(200).json({
    success: true,
    complaint: updatedComplaint,
  });
});

// delete garbage collection request
export const deleteComplaint = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { complaintId } = req.params;

  const deletedComplaint = await ComplaintModel.findByIdAndDelete(complaintId);

  if (!deletedComplaint) {
    return next(new ErrorHandler("Complaint not found", 404));
  }

  res.status(204).json({
    success: true,
    message: "Complaint deleted successfully",
  });
});
