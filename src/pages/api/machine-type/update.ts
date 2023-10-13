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

    const { id, code, name } = req.body;

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

    const existDepartment = await prisma.department.findUnique({
      where: {
        id: id
      },
    });

    if (!existDepartment) {
      res.status(400).json({
        message: 'The department using the provided code was not found.',
      });
      return;
    }

    const department = await prisma.department.upsert({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      where: { id: id },
      update: {
        code: code,
        name: name,
        createdbyid: userId,
        updatedbyid: userId,
      },
      create: {
        code: code,
        name: name,
        createdbyid: userId,
        updatedbyid: userId,
      }
    })

    res.status(200).json({
      department,
    });
  } catch (error) {
    console.error('[department API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
