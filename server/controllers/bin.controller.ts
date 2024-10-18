import { Request, Response, NextFunction } from "express";
import BinModel from "../models/bin.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// Creates a new bin
export const createBin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newBin = await BinModel.create(req.body);
        res.status(201).json({
            success: true,
            bin: newBin
        });
    } catch (error) {
        next(error);
    }
};

//Retrieves all bins
export const getBins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bins = await BinModel.find().populate('userId');
        res.status(200).json({
            success: true,
            bins
        });
    } catch (error) {
        next(error);
    }
};

//Retrieves bins by user ID
export const getBinsbyid = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required.",
        });
    }
    const bins = await BinModel.find({ userId }).populate('userId', 'name');
    res.status(200).json({
        success: true,
        bins: bins.length ? bins : [],
    });
});

//Updates a bin by binId
export const updateBin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { binId } = req.params;
    const updates = req.body;
    const updatedBin = await BinModel.findByIdAndUpdate(binId, updates, { new: true });
    if (!updatedBin) {
        return next(new ErrorHandler("Bin not found", 404));
    }
    res.status(200).json({
        success: true,
        bin: updatedBin,
    });
});

//Deletes a bin by binId
export const deleteBin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { binId } = req.params;
    const deletedBin = await BinModel.findByIdAndDelete(binId);
    if (!deletedBin) {
        return next(new ErrorHandler("Bin not found", 404));
    }
    res.status(204).json({
        success: true,
        message: "Bin deleted successfully",
    });
});

//Updates the status of a bin (isCollected)
export const updateBinStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { binId } = req.params;
        const { isCollected } = req.body;
        const bin = await BinModel.findById(binId);
        if (!bin) {
            res.status(404).json({ message: 'Bin not found' });
            return;
        }
        bin.isCollected = isCollected;
        bin.collectionHistory.push({
            status: isCollected,
            timestamp: new Date(),
        });
        await bin.save();
        res.status(200).json({ message: 'Bin status updated successfully', bin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bin status', error });
    }
};
//Generates a report of bin within a specified date range
export const getBinStatusReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { binId } = req.params;
        const { startDate, endDate } = req.query;
        const bin = await BinModel.findById(binId);
        if (!bin) {
            res.status(404).json({ message: 'Bin not found' });
            return;
        }
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const filteredHistory = bin.collectionHistory.filter(
            (entry) => entry.timestamp >= start && entry.timestamp <= end
        );
        const trueCount = filteredHistory.filter((entry) => entry.status).length;
        const falseCount = filteredHistory.filter((entry) => !entry.status).length;
        res.status(200).json({
            binId,
            startDate: start,
            endDate: end,
            trueCount,
            falseCount,
            totalChanges: filteredHistory.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating bin status report', error });
    }
};

//Generates a report for all bins within a specified date range
export const getAllBinsStatusReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.body;
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const bins = await BinModel.find();
        if (!bins || bins.length === 0) {
            res.status(404).json({ message: 'No bins found' });
            return;
        }
        let totalTrueCount = 0;
        let totalFalseCount = 0;
        for (const bin of bins) {
            const filteredHistory = bin.collectionHistory.filter(
                (entry) => entry.timestamp >= start && entry.timestamp <= end
            );
            totalTrueCount += filteredHistory.filter((entry) => entry.status).length;
            totalFalseCount += filteredHistory.filter((entry) => !entry.status).length;
        }
        res.status(200).json({
            totalTrueCount,
            totalFalseCount,
            totalChanges: totalTrueCount + totalFalseCount,
            totalBins: bins.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating total bin status report', error });
    }
};
