import { IResponseBody } from '@/types/common.types';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const schemaOptions = {
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const validateWithSchema = <T, R extends IResponseBody>(schema: Joi.ObjectSchema<T>, validate: 'body' | 'query' | 'headers' | 'params' = 'body') => {
  return (req: Request, res: Response<R>, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req[validate], schemaOptions);

      if (error) throw error.message;

      next();
    } catch (error) {
      const response = {
        message: 'Validation failed',
        status: false,
        error,
      } as R;

      res.status(400).json(response);
    }
  };
};

export const registerValidator = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});
