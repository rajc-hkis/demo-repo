import { prisma } from '@/config/database';
import { IRegisterUser, IRegisterUserResponse } from '@/types/auth.types';
import { Request, Response } from 'express';

export const registerUser = async (req: Request<unknown, unknown, IRegisterUser>, res: Response<IRegisterUserResponse>): Promise<void> => {
  try {
    const { email, password, name, inviteCode } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // User already exists so return error
    if (userExists) {
      res.status(409).json({ message: 'User already exists', status: false, user: null });
      return;
    }

    if (inviteCode) {
      // go to database and give rewards to user
      await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });
    } else {
      // Take money from user
      await prisma.user.findMany({
        where: {
          deletedAt: null,
        },
      });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    res.status(201).json({ message: 'User created successfully', status: true, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: false, user: null, error });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });

    res.status(200).json({ message: 'Users fetched successfully', status: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: false, users: null, error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      args: {
        where: {
          id,
        },
      },
      query: prisma.user.update,
    });

    res.status(200).json({ message: 'User deleted successfully', status: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: false, user: null, error });
  }
};
