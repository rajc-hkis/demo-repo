import { User } from '@prisma/client';

export const createUserMock: User = {
  id: 'skdjh327',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedpassword',
  jwtSequence: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
