import { Router } from 'express';
import { deleteUser, listUsers, registerUser } from '@/controllers/auth.controller';
import { registerValidator, validateWithSchema } from '@/validators/auth.validator';

const authRoutes = Router();

authRoutes.post('/register', validateWithSchema(registerValidator, 'body'), registerUser);
authRoutes.get('/list', listUsers);
authRoutes.delete('/delete/:id', deleteUser);

export default authRoutes;
