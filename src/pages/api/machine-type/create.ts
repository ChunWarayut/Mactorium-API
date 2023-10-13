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

    const { code, name } = req.body;

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

    const existMachineType = await prisma.machinetype.findUnique({
      where: {
        code: code
      },
    });

    if (existMachineType) {
      res.status(400).json({
        message: 'There already exists an machinetype with the given code.',
      });
      return;
    }

    const machinetype = await prisma.machinetype.create({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      data: {
        code: code,
        name: name,
        createdbyid: userId,
        updatedbyid: userId,
      }
    })

    res.status(200).json({
      machinetype,
    });
  } catch (error) {
    console.error('[machinetype API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
