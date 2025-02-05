import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const passwordHashExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      user: {
        async create({ args, query }) {
          if (args.data?.password) {
            const saltRounds = 10;
            args.data.password = await bcrypt.hash(args.data.password, saltRounds);
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data?.password) {
            const saltRounds = 10;
            args.data.password = await bcrypt.hash(args.data.password as string, saltRounds);
          }
          return query(args);
        },
      },
    },
  });
});

export const softDeleteExtension = Prisma.defineExtension({
  model: {
    user: {
      async delete({ args, query }: { args: Prisma.UserDeleteArgs; query: (args: Prisma.UserUpdateArgs) => Promise<User> }) {
        return query({
          where: args.where,
          data: { deletedAt: new Date() }, // Assuming `deletedAt` is in your schema
        });
      },
    },
  },
});
