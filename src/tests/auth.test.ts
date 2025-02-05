import { request, prismaMock } from './setup';
import { createUserMock } from './mocks/user';

describe('Auth Controller', () => {
  describe('Register API', () => {
    it('should return error if fields are missing', async () => {
      const response = await request.post('/api/auth/register').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });

    it('should register user successfully', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createUserMock);

      const response = await request.post('/api/auth/register').send({
        name: createUserMock.name,
        email: createUserMock.email,
        password: createUserMock.password,
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.user.name).toBe(createUserMock.name);
    });

    it('should throw error if user already exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue(createUserMock);

      const response = await request.post('/api/auth/register').send({
        name: createUserMock.name,
        email: createUserMock.email,
        password: createUserMock.password,
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
    });
  });
});
