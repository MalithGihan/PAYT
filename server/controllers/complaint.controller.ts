import { Request, Response, NextFunction } from "express";
import ComplaintModel from "../models/complaint.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors"; 
import ErrorHandler from "../utils/ErrorHandler";

export const createComplaint = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  const userId = req.user?._id as string;

  const newComplaint = await ComplaintModel.create({ userId, message });
  res.status(201).json({
    success: true,
    complaint: newComplaint,
  });
});

export const getComplaints = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id as string;
  const complaints = await ComplaintModel.find({ userId });

  res.status(200).json({
    success: true,
    complaints,
  });
});

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
