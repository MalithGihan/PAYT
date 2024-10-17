import request from 'supertest'; 
import { app } from '../app'; 

describe('Auth API', () => {
  it('should log in a user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'doodiscover@gmail.com', // Provide valid login credentials
        password: '123456',
      });
      
    // Perform assertions
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
  }, 12000); // Timeout is increased to 10 seconds (10000 ms)
});
