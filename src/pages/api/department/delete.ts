import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { id } = req.body;

    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }

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

    await prisma.department.delete({
      where: {
        id: id
      }
    })

    const department = await prisma.department.findMany();
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
