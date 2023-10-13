import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/_mock/_auth';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { internalserial, name } = req.body;

    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }
    const accessToken = `${authorization}`.split(' ')[1];
    const _user = verify(accessToken, JWT_SECRET);
    const userId = typeof _user === 'object' ? _user?.userId : '';

    const existMachine = await prisma.machine.findUnique({
      where: {
        internalserial: internalserial
      },
    });

    if (existMachine) {
      res.status(400).json({
        message: 'There already exists an machine with the given code.',
      });
      return;
    }

    const machine = await prisma.machine.create({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      data: {
        internalserial: internalserial,
        name: name,
        createdbyid: userId,
        updatedbyid: userId,
      }
    })

    res.status(200).json({
      machine,
    });
  } catch (error) {
    console.error('[machine API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
