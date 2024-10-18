import { createBin, getBins, getBinsbyid } from '../controllers/bin.controller';
import { Request, Response, NextFunction } from 'express';
import BinModel from '../models/bin.model';

// Mock the BinModel
jest.mock('../models/bin.model');
jest.mock('../middleware/catchAsyncErrors', () => ({
    CatchAsyncError: (fn: any) => fn
}));

//unit tests for `createBin`, `getBins`, and `getBinsbyid` functions
describe('Bin Controller Test Suite', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    // Common setup before each test
    beforeEach(() => {
        req = {
            body: {
                userId: 'user123',
                location: 'locationA',
                size: 'large',
                isCollected: false,
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    //Test case for `createBin` Function
    describe('createBin Tests', () => {
        it('should create a new bin with valid data', async () => {
            const newBin = {
                userId: 'user123',
                location: 'locationA',
                size: 'large',
                isCollected: false
            };
            (BinModel.create as jest.Mock).mockResolvedValue(newBin);

            await createBin(req as Request, res as Response, next);

            expect(BinModel.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, bin: newBin });
        });
    });

    // Test case for `getBins` Function
    describe('getBins Tests', () => {
        it('should retrieve all bins successfully', async () => {
            const mockBins = [
                { _id: '1', location: 'Location 1', size: 'Small', userId: { name: 'John Doe' } },
                { _id: '2', location: 'Location 2', size: 'Medium', userId: { name: 'Jane Doe' } },
            ];

            (BinModel.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockBins),
            });

            await getBins(req as Request, res as Response, next);

            expect(BinModel.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                bins: mockBins,
            });
        });
    });
});

//Test case for `getBinsbyid` Function
describe('getBinsbyid Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {
                userId: 'user123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve bins for a specific user successfully', async () => {
        const mockBins = [
            {
                _id: '1',
                location: 'Location 1',
                size: 'Small',
                userId: { name: 'John Doe' }
            },
            {
                _id: '2',
                location: 'Location 2',
                size: 'Medium',
                userId: { name: 'John Doe' }
            }
        ];

        (BinModel.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockBins)
        });

        await getBinsbyid(req as Request, res as Response, next);

        expect(BinModel.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            bins: mockBins
        });
    });
});