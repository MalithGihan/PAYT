import request from 'supertest';
import { app } from '../app';
import userModel from '../models/user.models'; // Assuming this is your user model

jest.mock('../models/user.models.ts');
jest.mock('../middleware/catchAsyncErrors', () => ({
  CatchAsyncError: (fn: any) => fn
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should log in a user successfully', async () => {
    // Mock user data with a valid user and password
    const mockUser = {
      _id: 'user123',
      email: 'doodiscover@gmail.com',
      password: 'hashedpassword', // Hashed password
      comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
      SignAccessToken: jest.fn().mockReturnValue('fakeToken123'), // Mock token generation
    };

    // Mock userModel.findOne and ensure select works
    const mockFindOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser), // Mock the select method to return the mock user
    });
    (userModel.findOne as jest.Mock).mockImplementation(mockFindOne);

    const response = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'doodiscover@gmail.com',
        password: '12345678', // The raw password you are testing with
      });

    // Log response body for debugging if needed
    console.log(response.body);

    // Perform assertions
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'doodiscover@gmail.com' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('12345678');
    expect(mockUser.SignAccessToken).toHaveBeenCalled(); // Assert the token function is called
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe('fakeToken123'); // Assuming token is returned in the response
  });

  it('should return 400 if invalid email or password is provided', async () => {
    // Mock userModel.findOne to return null (user not found)
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'invalidemail@gmail.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false); // Assuming your error handler returns success: false
  });
});
