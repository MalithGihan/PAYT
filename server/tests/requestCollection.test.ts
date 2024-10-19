import { createRequestController, getRequestsController ,deleteRequestController} from '../controllers/requestcollect.controller';
import { Request, Response, NextFunction } from 'express';
import RequestCollectModel from '../models/RequestCollect';
import ErrorHandler from "../utils/ErrorHandler";

// Mock the RequestCollectModel
jest.mock('../models/RequestCollect');
jest.mock('../middleware/catchAsyncErrors', () => ({
    CatchAsyncError: (fn: any) => fn
}));

describe('Request Collect Controller Test Suite', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                binId: 'bin123',
                message: 'Test message',
            },
            user: {
                _id: 'user123',
            } as any,
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

    describe('createRequestController Tests', () => {
        it('should create a new request with valid data', async () => {
            const newRequest = {
                _id: 'request123',
                userId: 'user123',
                binId: 'bin123',
                status: 'pending',
                message: 'Test message',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (RequestCollectModel.create as jest.Mock).mockResolvedValue(newRequest);

            await createRequestController(req as Request, res as Response, next);

            expect(RequestCollectModel.create).toHaveBeenCalledWith({
                userId: 'user123',
                binId: 'bin123',
                message: 'Test message',
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                request: newRequest,
            });

            // it('should handle errors if RequestCollectModel.create fails', async () => {
            //   const errorMessage = 'Error creating request';
            //   (RequestCollectModel.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            //   await createRequestController(req as Request, res as Response, next);

            //   expect(next).toHaveBeenCalledWith(new Error(errorMessage));
            // });

        });
    });

    // Adding getRequestsController Tests
    describe('getRequestsController Tests', () => {
        it('should retrieve all requests successfully', async () => {
            const mockRequests = [
                { _id: 'request1', message: 'Request 1', userId: 'user123', binId: 'bin123' },
                { _id: 'request2', message: 'Request 2', userId: 'user456', binId: 'bin456' },
            ];

            // Mock the RequestCollectModel.find method to return all mock requests
            (RequestCollectModel.find as jest.Mock).mockResolvedValue(mockRequests);

            await getRequestsController(req as Request, res as Response, next);

            expect(RequestCollectModel.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                requests: mockRequests,
            });
        });

        // it('should handle errors when RequestCollectModel.find fails', async () => {
        //   const errorMessage = 'Error retrieving requests';

        //   // Mock the RequestCollectModel.find method to throw an error
        //   (RequestCollectModel.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

        //   await getRequestsController(req as Request, res as Response, next);

        //   expect(next).toHaveBeenCalledWith(new Error(errorMessage));
        // });
    });
});

describe('deleteRequestController Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {
                requestId: 'request123'
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

    // Test case 1: Successful deletion of the request
    it('should delete the request successfully and return 204', async () => {
        // Simulate successful deletion by returning a deleted object
        (RequestCollectModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
            _id: 'request123',
            location: 'Location 1',
            status: 'Pending'
        });

        await deleteRequestController(req as Request, res as Response, next);

        expect(RequestCollectModel.findByIdAndDelete).toHaveBeenCalledWith('request123');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Request deleted successfully',
        });
    });

    // Test case 2: Request not found (404 error)
    // it('should return 404 if the request to delete is not found', async () => {
    //     // Simulate request not found by returning null
    //     (RequestCollectModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    //     await deleteRequestController(req as Request, res as Response, next);

    //     expect(RequestCollectModel.findByIdAndDelete).toHaveBeenCalledWith('request123');
    //     expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    //     expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Request not found', statusCode: 404 }));
    // });

    // Test case 3: Handle errors during deletion
    // it('should call next with an error if there is a database error during deletion', async () => {
    //     const errorMessage = 'Database error';
    //     (RequestCollectModel.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error(errorMessage));

    //     await deleteRequestController(req as Request, res as Response, next);

    //     expect(RequestCollectModel.findByIdAndDelete).toHaveBeenCalledWith('request123');
    //     expect(next).toHaveBeenCalledWith(expect.any(Error));
    //     expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    // });
});
