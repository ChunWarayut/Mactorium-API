import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { sign } from 'jsonwebtoken';

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { _users, JWT_SECRET, JWT_EXPIRES_IN } from 'src/_mock/_auth';
import { _mock } from 'src/_mock';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { email, password, firstName, lastName } = req.body;

    const existUser = await prisma.user.findUnique({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      where: {
        email: email
      },
    });

    if (existUser) {
      res.status(400).json({
        message: 'There already exists an account with the given email address.',
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        code: faker.airline.flightNumber({
          addLeadingZeros: true
        }),
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`,
      }
    })

    const accessToken = sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error('[Auth API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
