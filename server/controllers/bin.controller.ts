import { Request, Response, NextFunction } from "express";
import BinModel from "../models/bin.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

export const createBin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, location, size, isCollected } = req.body;

    const newBin = await BinModel.create({ userId, location, size, isCollected });

    res.status(201).json({
        success: true,
        bin: newBin,
    });
});


// export const getBins = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.user?._id as string;
//     const bins = await BinModel.find({ userId });

//     res.status(200).json({
//         success: true,
//         bins,
//     });
// });

export const getBins = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const bins = await BinModel.find({}).populate('userId', 'name');
    res.status(200).json({
        success: true,
        bins,
    });
});


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

export const updateBinStatus = async (req: Request, res: Response) => {
    try {
        const { binId } = req.params;
        const { isCollected } = req.body;

        const bin = await BinModel.findById(binId);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        bin.isCollected = isCollected;
        bin.collectionHistory.push({
            status: isCollected,
            timestamp: new Date()
        });

        await bin.save();

        res.status(200).json({ message: 'Bin status updated successfully', bin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bin status', error });
    }
};

export const getBinStatusReport = async (req: Request, res: Response) => {
    try {
        const { binId } = req.params;
        const { startDate, endDate } = req.query;

        const bin = await BinModel.findById(binId);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
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
            totalChanges: filteredHistory.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating bin status report', error });
    }
};