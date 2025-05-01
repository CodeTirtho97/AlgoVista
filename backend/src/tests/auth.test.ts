import request from 'supertest';
import App from '../app';
import { User } from '../models';

const app = new App().app;

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User'
  };
  
  let authToken: string;
  
  describe('User Registration', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });
    
    it('should not register a user with an existing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Email already in use');
    });
    
    it('should not register a user with an existing username', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'another@example.com' // Different email, same username
        });
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Username already in use');
    });
    
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'incomplete@example.com'
          // Missing other required fields
        });
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('User Login', () => {
    it('should login an existing user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      
      // Store token for protected route tests
      authToken = response.body.data.token;
    });
    
    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid email or password');
    });
    
    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid email or password');
    });
  });
  
  describe('Protected Routes', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
    });
    
    it('should not access protected route without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile');
      
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Authentication required');
    });
    
    it('should update user profile', async () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name'
      };
      
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.firstName).toBe(updatedData.firstName);
      expect(response.body.data.user.lastName).toBe(updatedData.lastName);
    });
    
    it('should change password', async () => {
      const newPassword = 'NewPassword456!';
      
      const response = await request(app)
        .put('/api/v1/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toContain('Password updated successfully');
      
      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword
        });
      
      expect(loginResponse.status).toBe(200);
    });
    
    it('should not change password with incorrect current password', async () => {
      const response = await request(app)
        .put('/api/v1/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'AnotherPassword789!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Current password is incorrect');
    });
  });
});