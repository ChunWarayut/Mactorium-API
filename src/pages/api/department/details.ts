import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);
    
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }

    const id: number = req.query.id as unknown as number;

    const department = await prisma.department.findUnique({
      include: {
        createdby: {
        },
        updatedby: {
        },
      },
      where: {
        id: parseInt(id.toString()),
      },
    })

    if (!department) {
      res.status(404).json({
        message: 'department Not Found!',
      });
      return;
    }

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
