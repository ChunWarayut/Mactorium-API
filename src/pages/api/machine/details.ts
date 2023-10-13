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

    const machine = await prisma.machine.findUnique({
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

    if (!machine) {
      res.status(404).json({
        message: 'machine Not Found!',
      });
      return;
    }

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
